import { InternalServerErrorException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import * as jmespath from "jmespath";
import { nanoid } from "nanoid";
import { ConfigService } from "../../config/config.service";
import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";
import { ErrorPageException } from "../exceptions/errorPage.exception";
import { OAuthProvider, OAuthToken } from "./oauthProvider.interface";

export abstract class GenericOidcProvider implements OAuthProvider<OidcToken> {
  protected discoveryUri: string;
  private configuration: OidcConfigurationCache;
  private jwk: OidcJwkCache;
  private logger: Logger = new Logger(
    Object.getPrototypeOf(this).constructor.name,
  );

  protected constructor(
    protected name: string,
    protected keyOfConfigUpdateEvents: string[],
    protected config: ConfigService,
    protected jwtService: JwtService,
    protected cache: Cache,
  ) {
    this.discoveryUri = this.getDiscoveryUri();
    this.config.addListener("update", (key: string) => {
      if (this.keyOfConfigUpdateEvents.includes(key)) {
        this.deinit();
        this.discoveryUri = this.getDiscoveryUri();
      }
    });
  }

  protected getRedirectUri(): string {
    return `${this.config.get("general.appUrl")}/api/oauth/callback/${
      this.name
    }`;
  }

  async getConfiguration(): Promise<OidcConfiguration> {
    if (!this.configuration || this.configuration.expires < Date.now()) {
      await this.fetchConfiguration();
    }
    return this.configuration.data;
  }

  async getJwk(): Promise<OidcJwk[]> {
    if (!this.jwk || this.jwk.expires < Date.now()) {
      await this.fetchJwk();
    }
    return this.jwk.data;
  }

  async getAuthEndpoint(state: string) {
    const configuration = await this.getConfiguration();
    const endpoint = configuration.authorization_endpoint;

    const nonce = nanoid();
    await this.cache.set(
      `oauth-${this.name}-nonce-${state}`,
      nonce,
      1000 * 60 * 5,
    );

    return (
      endpoint +
      "?" +
      new URLSearchParams({
        client_id: this.config.get(`oauth.${this.name}-clientId`),
        response_type: "code",
        scope:
          this.name == "oidc"
            ? this.config.get(`oauth.oidc-scope`)
            : "openid email profile",
        redirect_uri: this.getRedirectUri(),
        state,
        nonce,
      }).toString()
    );
  }

  async getToken(query: OAuthCallbackDto): Promise<OAuthToken<OidcToken>> {
    const configuration = await this.getConfiguration();
    const endpoint = configuration.token_endpoint;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.config.get(`oauth.${this.name}-clientId`),
        client_secret: this.config.get(`oauth.${this.name}-clientSecret`),
        grant_type: "authorization_code",
        code: query.code,
        redirect_uri: this.getRedirectUri(),
      }).toString(),
    });
    const token = (await res.json()) as OidcToken;
    return {
      accessToken: token.access_token,
      expiresIn: token.expires_in,
      idToken: token.id_token,
      refreshToken: token.refresh_token,
      tokenType: token.token_type,
      rawToken: token,
    };
  }

  async getUserInfo(
    token: OAuthToken<OidcToken>,
    query: OAuthCallbackDto,
    claim?: string,
    roleConfig?: {
      path?: string;
      generalAccess?: string;
      adminAccess?: string;
    },
  ): Promise<OAuthSignInDto> {
    const idTokenData = this.decodeIdToken(token.idToken);

    if (!idTokenData) {
      this.logger.error(
        `Can not get ID Token from response ${JSON.stringify(token.rawToken, undefined, 2)}`,
      );
      throw new InternalServerErrorException();
    }

    const key = `oauth-${this.name}-nonce-${query.state}`;
    const nonce = await this.cache.get(key);
    await this.cache.del(key);
    if (nonce !== idTokenData.nonce) {
      this.logger.error(
        `Invalid nonce. Expected ${nonce}, but got ${idTokenData.nonce}`,
      );
      throw new ErrorPageException("invalid_token");
    }

    const username = claim
      ? idTokenData[claim]
      : idTokenData.preferred_username ||
        idTokenData.name ||
        idTokenData.nickname;

    let isAdmin: boolean;

    if (roleConfig?.path) {
      // A path to read roles from the token is configured
      let roles: string[] = [];
      try {
        roles = jmespath.search(idTokenData, roleConfig.path);
      } catch (e) {
        this.logger.warn(
          `Roles not found at path ${roleConfig.path} in ID Token ${JSON.stringify(
            idTokenData,
            undefined,
            2,
          )}`,
        );
      }

      if (
        roleConfig.generalAccess &&
        !roles.includes(roleConfig.generalAccess)
      ) {
        // Role for general access is configured and the user does not have it
        this.logger.error(
          `User roles ${roles} do not include ${roleConfig.generalAccess}`,
        );
        throw new ErrorPageException("user_not_allowed");
      }
      if (roleConfig.adminAccess) {
        // Role for admin access is configured
        isAdmin = roles.includes(roleConfig.adminAccess);
      }
    }

    if (!username) {
      this.logger.error(
        `Can not get username from ID Token ${JSON.stringify(
          idTokenData,
          undefined,
          2,
        )}`,
      );
      throw new ErrorPageException("cannot_get_user_info", undefined, [
        `provider_${this.name}`,
      ]);
    }

    return {
      provider: this.name as any,
      email: idTokenData.email,
      providerId: idTokenData.sub,
      providerUsername: username,
      ...(isAdmin !== undefined && { isAdmin }),
      idToken: `${this.name}:${token.idToken}`,
    };
  }

  protected abstract getDiscoveryUri(): string;

  private async fetchConfiguration(): Promise<void> {
    const res = await fetch(this.discoveryUri);
    const expires = res.headers.has("expires")
      ? new Date(res.headers.get("expires")).getTime()
      : Date.now() + 1000 * 60 * 60 * 24;
    this.configuration = {
      expires,
      data: (await res.json()) as OidcConfiguration,
    };
  }

  private async fetchJwk(): Promise<void> {
    const configuration = await this.getConfiguration();
    const res = await fetch(configuration.jwks_uri);
    const expires = res.headers.has("expires")
      ? new Date(res.headers.get("expires")).getTime()
      : Date.now() + 1000 * 60 * 60 * 24;
    this.jwk = {
      expires,
      data: (await res.json())["keys"],
    };
  }

  private deinit() {
    this.discoveryUri = undefined;
    this.configuration = undefined;
    this.jwk = undefined;
  }

  private decodeIdToken(idToken: string): OidcIdToken {
    return this.jwtService.decode(idToken) as OidcIdToken;
  }
}

export interface OidcCache<T> {
  expires: number;
  data: T;
}

export interface OidcConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  jwks_uri: string;
  response_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  scopes_supported?: string[];
  claims_supported?: string[];
  frontchannel_logout_supported?: boolean;
  end_session_endpoint?: string;
}

export interface OidcJwk {
  e: string;
  alg: string;
  kid: string;
  use: string;
  kty: string;
  n: string;
}

export type OidcConfigurationCache = OidcCache<OidcConfiguration>;

export type OidcJwkCache = OidcCache<OidcJwk[]>;

export interface OidcToken {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  id_token: string;
}

export interface OidcIdToken {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  email: string;
  name: string;
  nickname: string;
  preferred_username: string;
  nonce: string;
}
