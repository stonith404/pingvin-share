interface OAuthSignInDto {
  provider: 'github' | 'google' | 'oidc';
  providerId: string;
  providerUsername: string;
  email: string;
}