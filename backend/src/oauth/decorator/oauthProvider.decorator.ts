import { SetMetadata } from '@nestjs/common';

export const OAuthProvider = (provider: string) => SetMetadata('oauthProvider', provider);