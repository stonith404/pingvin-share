import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from "../../config/config.service";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      callbackURL: config.get('general.appUrl') + '/api/oauth/google/callback',
      clientID: config.get('oauth.google-clientId'),
      clientSecret: config.get('oauth.google-clientSecret'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(profile);
    const { id, displayName, emails } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      providerUsername: displayName,
      email: emails.find((v: { verified: boolean; }) => v.verified).value,
    };

    done(null, user);
  }
}
