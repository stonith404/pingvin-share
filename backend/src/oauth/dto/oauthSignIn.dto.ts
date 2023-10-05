interface OAuthSignInDto {
  provider: 'github' | 'google';
  providerId: string;
  providerUsername: string;
  email: string;
}