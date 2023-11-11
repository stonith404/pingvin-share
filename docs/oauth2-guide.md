# OAuth 2 Login Guide

## Config Built-in OAuth 2 Providers

- [GitHub](#github)
- [Google](#google)
- [Microsoft](#microsoft)
- [Discord](#discord)
- [OpenID Connect](#openid-connect)

### GitHub

Please follow the [official guide](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) to create an OAuth app.

Redirect URL: `https://<your-domain>/api/oauth/callback/github`

### Google

Please follow the [official guide](https://developers.google.com/identity/protocols/oauth2/web-server#prerequisites) to create an OAuth 2.0 App.

Redirect URL: `https://<your-domain>/api/oauth/callback/google`

### Microsoft

Please follow the [official guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) to register an application.

> [!IMPORTANT]
> **Microsoft Tenant** you set in the admin panel must match the **supported account types** you set in the Microsoft Entra admin center, otherwise the OAuth login will not work. Refer to the [official documentation](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc#find-your-apps-openid-configuration-document-uri) for more details.

Redirect URL: `https://<your-domain>/api/oauth/callback/microsoft`

### Discord

Create an application on [Discord Developer Portal](https://discord.com/developers/applications).

Redirect URL: `https://<your-domain>/api/oauth/callback/discord`

### OpenID Connect

Generic OpenID Connect provider is also supported, we have tested it on Keycloak, Authentik and Casdoor.

Redirect URL: `https://<your-domain>/api/oauth/callback/oidc`

## Custom your OAuth 2 Provider

If our built-in providers don't meet your needs, you can create your own OAuth 2 provider.

### 1. Create config

Add your config (client id, client secret, etc.) in [`config.seed.ts`](../backend/prisma/seed/config.seed.ts):

```ts
const configVariables: ConfigVariables = {
  // ...
  oauth: {
    // ...
    "YOUR_PROVIDER_NAME-enabled": {
      type: "boolean",
      defaultValue: "false",
    },
    "YOUR_PROVIDER_NAME-clientId": {
      type: "string",
      defaultValue: "",
    },
    "YOUR_PROVIDER_NAME-clientSecret": {
      type: "string",
      defaultValue: "",
      obscured: true,
    },
  }
}
```

### 2. Create provider class

#### Generic OpenID Connect

If your provider supports OpenID connect, it's extremely easy to extend [`GenericOidcProvider`](../backend/src/oauth/provider/genericOidc.provider.ts) to add a new OpenID Connect provider.

The [Google provider](../backend/src/oauth/provider/google.provider.ts) and [Microsoft provider](../backend/src/oauth/provider/microsoft.provider.ts) are good examples.

Here are some discovery URIs for popular providers:

- Microsoft: `https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration`
- Google: `https://accounts.google.com/.well-known/openid-configuration`
- Apple: `https://appleid.apple.com/.well-known/openid-configuration`
- Gitlab: `https://gitlab.com/.well-known/openid-configuration`
- Huawei: `https://oauth-login.cloud.huawei.com/.well-known/openid-configuration`
- Paypal: `https://www.paypal.com/.well-known/openid-configuration`
- Yahoo: `https://api.login.yahoo.com/.well-known/openid-configuration`

#### OAuth 2

If your provider only supports OAuth 2, you can implement [`OAuthProvider`](../backend/src/oauth/provider/oauthProvider.interface.ts) interface to add a new OAuth 2 provider.

The [GitHub provider](../backend/src/oauth/provider/github.provider.ts) and [Discord provider](../backend/src/oauth/provider/discord.provider.ts) are good examples.

### 3. Register provider

Register your provider in [`OAuthModule`](../backend/src/oauth/oauth.module.ts) and [`OAuthSignInDto`](../backend/src/oauth/dto/oauthSignIn.dto.ts):

```ts
@Module({
  providers: [
    GitHubProvider,
    // your provider
    {
      provide: "OAUTH_PROVIDERS",
      useFactory(github: GitHubProvider, /* your provider */): Record<string, OAuthProvider<unknown>> {
        return {
          github,
          /* your provider */
        };
      },
      inject: [GitHubProvider, /* your provider */],
    },
  ],
})
export class OAuthModule {
}
```

```ts
export interface OAuthSignInDto {
  provider: 'github' | 'google' | 'microsoft' | 'discord' | 'oidc' /* your provider*/;
  providerId: string;
  providerUsername: string;
  email: string;
}
```

### 4. Add frontend icon

Add an icon in [`oauth.util.tsx`](../frontend/src/utils/oauth.util.tsx).

```tsx
const getOAuthIcon = (provider: string) => {
  return {
    'github': <SiGithub />,
    /* your provider */
  }[provider];
}
```

### 5. Add i18n text

Add keys below to your i18n text in [locale file](../frontend/src/i18n/translations/en-US.ts).

- `signIn.oauth.YOUR_PROVIDER_NAME`
- `account.card.oauth.YOUR_PROVIDER_NAME`
- `admin.config.oauth.YOUR_PROVIDER_NAME-enabled`
- `admin.config.oauth.YOUR_PROVIDER_NAME-client-id`
- `admin.config.oauth.YOUR_PROVIDER_NAME-client-secret`
- `error.param.provider_YOUR_PROVIDER_NAME`
- Other config keys you defined in step 1

Congratulations! 🎉 You have successfully added a new OAuth 2 provider! Pull requests are welcome if you want to share your provider with others.
