import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import fetch from "node-fetch";
import { ConfigService } from "../config/config.service";
import { JwtService } from "@nestjs/jwt";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { nanoid } from "nanoid";
import { OidcCallbackDto } from "./dto/oidcCallback.dto";

@Injectable()
export class OidcService {
  protected configuration: OidcConfigurationCache;
  protected jwk: OidcJwkCache;
  protected redirectUri: string;
  protected name: string = "oidc";
  protected keyOfConfigUpdateEvents: string[] = ["oauth.oidc-enabled", "oauth.oidc-discoveryUri"];

  constructor(@Inject("OIDC_DISCOVERY_URI") protected discoveryUri: string,
              protected config: ConfigService,
              protected jwtService: JwtService,
              @Inject(CACHE_MANAGER) protected cache: Cache) {
    this.redirectUri = `${this.config.get("general.appUrl")}/api/oauth/${this.name}/callback`;
    this.config.addListener("update", (key: string, _: unknown) => {
      if (this.keyOfConfigUpdateEvents.includes(key)) {
        this.deinit();
        this.discoveryUri = this.config.get(`oauth.${this.name}-discoveryUri`);
      }
    });
  }

  private async fetchConfiguration(): Promise<void> {
    const res = await fetch(this.discoveryUri);
    const expires = res.headers.has("expires") ? new Date(res.headers.get("expires")).getTime() : Date.now() + 1000 * 60 * 60 * 24;
    this.configuration = {
      expires,
      data: await res.json(),
    };
  }

  private async fetchJwk(): Promise<void> {
    const configuration = await this.getConfiguration();
    const res = await fetch(configuration.jwks_uri);
    const expires = res.headers.has("expires") ? new Date(res.headers.get("expires")).getTime() : Date.now() + 1000 * 60 * 60 * 24;
    this.jwk = {
      expires,
      data: (await res.json())['keys'],
    };
  }

  private deinit() {
    this.discoveryUri = undefined;
    this.configuration = undefined;
    this.jwk = undefined;
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
    await this.cache.set(`oauth-${this.name}-nonce-${state}`, nonce, 1000 * 60 * 5);

    return endpoint + "?" + new URLSearchParams({
      client_id: this.config.get(`oauth.${this.name}-clientId`),
      response_type: "code",
      scope: "openid profile email",
      redirect_uri: this.redirectUri,
      state,
      nonce,
    }).toString();
  }

  async getToken(code: string): Promise<OidcToken> {
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
        code,
        redirect_uri: this.redirectUri,
      }).toString(),
    });
    return await res.json();
  }

  private decodeIdToken(idToken: string): OidcIdToken {
    return this.jwtService.decode(idToken) as OidcIdToken;
  }

  async getUserInfo(query: OidcCallbackDto): Promise<OAuthSignInDto> {
    const token = await this.getToken(query.code);
    const idTokenData = this.decodeIdToken(token.id_token);
    // maybe it's not necessary to verify the id token since it's directly obtained from the provider

    const key = `oauth-${this.name}-nonce-${query.state}`;
    const nonce = await this.cache.get(key);
    await this.cache.del(key);
    if (nonce !== idTokenData.nonce) {
      throw new BadRequestException("Invalid token");
    }

    return {
      provider: this.name as any,
      email: idTokenData.email,
      providerId: idTokenData.sub,
      providerUsername: idTokenData.name,
    }
  }

}

export interface OidcCache<T> {
  expires: number,
  data: T,
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
  nonce: string;
}