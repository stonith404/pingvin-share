import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";

/**
 * @typeParam T - type of token
 * @typeParam C - type of callback query
 */
export interface OAuthProvider<T, C = OAuthCallbackDto> {
  getAuthEndpoint(state: string): Promise<string>;

  getToken(query: C): Promise<OAuthToken<T>>;

  getUserInfo(token: OAuthToken<T>, query: C): Promise<OAuthSignInDto>;
}

export interface OAuthToken<T> {
  accessToken: string;
  expiresIn?: number;
  refreshToken?: string;
  tokenType?: string;
  scope?: string;
  idToken?: string;
  rawToken: T;
}
