import { Anchor, LoadingOverlay, Text } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Meta from "../../components/Meta";
import SignInForm from "../../components/auth/SignInForm";
import useConfig from "../../hooks/config.hook";
import useTranslate from "../../hooks/useTranslate.hook";
import useUser from "../../hooks/user.hook";
import { getOAuthUrl } from "../../utils/oauth.util";
import { FormattedMessage } from "react-intl";

export function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { redirectPath: context.query.redirect ?? null },
  };
}

const SignIn = ({ redirectPath }: { redirectPath?: string }) => {
  const { refreshUser } = useUser();
  const router = useRouter();
  const t = useTranslate();
  const config = useConfig();
  const autoRedirect = config.get("oauth.autoRedirect");

  const [isLoading, setIsLoading] = useState(redirectPath ? true : false);

  // If the access token is expired, the middleware redirects to this page.
  // If the refresh token is still valid, the user will be redirected to the last page.
  useEffect(() => {
    if (autoRedirect) {
      router.replace(getOAuthUrl(config.get("general.appUrl"), autoRedirect));
    }

    refreshUser().then((user) => {
      if (user) {
        router.replace(redirectPath ?? "/upload");
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) return <LoadingOverlay overlayOpacity={1} visible />;

  return (
    <>
      <Meta title={t("signin.title")} />
      {autoRedirect ? (
        <Text align="center">
          <FormattedMessage
            id="signIn.text.redirecting"
            values={{
              a: (chunks) => (
                <Anchor
                  component={Link}
                  href={getOAuthUrl(config.get("general.appUrl"), autoRedirect)}
                >
                  {chunks}
                </Anchor>
              ),
            }}
          />
        </Text>
      ) : (
        <SignInForm redirectPath={redirectPath ?? "/upload"} />
      )}
    </>
  );
};
export default SignIn;
