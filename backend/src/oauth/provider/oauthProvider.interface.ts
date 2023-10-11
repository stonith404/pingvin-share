import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";

/**
 * @typeParam T - type of token
 */
export interface OAuthProvider<T> {
  getAuthEndpoint(state: string): Promise<string>;

  getToken(code: string): Promise<T>;

  getUserInfo(query: OAuthCallbackDto): Promise<OAuthSignInDto>;
}