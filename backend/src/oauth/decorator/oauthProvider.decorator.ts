import { SetMetadata } from '@nestjs/common';

export const OAuthProvider = (provider: string, type: "auth" | "callback") => SetMetadata(
  'oauth',
  {
    provider,
    type
  }
);