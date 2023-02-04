import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";
import SignInForm from "../../components/auth/SignInForm";
import Meta from "../../components/Meta";
import useUser from "../../hooks/user.hook";

const SignIn = () => {
  const router = useRouter();
  const { user } = useUser();

  // If the access token is expired, the middleware redirects to this page.
  // If the refresh token is still valid, the user will be redirected to the home page.
  if (user) {
    router.replace("/");
    return <LoadingOverlay overlayOpacity={1} visible />;
  }

  return (
    <>
      <Meta title="Sign In" />
      <SignInForm />
    </>
  );
};
export default SignIn;
