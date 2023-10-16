import { OAuthCallbackDto } from "../dto/oauthCallback.dto";
import { OAuthSignInDto } from "../dto/oauthSignIn.dto";

/**
 * @typeParam T - type of token
 * @typeParam C - type of callback query
 */
export interface OAuthProvider<T, C = OAuthCallbackDto> {
  getAuthEndpoint(state: string): Promise<string>;

  getToken(code: string): Promise<T>;

  getUserInfo(query: C): Promise<OAuthSignInDto>;
}
