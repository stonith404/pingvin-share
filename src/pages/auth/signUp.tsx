import { useRouter } from "next/router";
import React, { useContext } from "react";
import AuthForm from "../../components/auth/AuthForm";
import Meta from "../../components/Meta";
import { IsSignedInContext } from "../../utils/auth.util";
import { useConfig } from "../../utils/config.util";

const SignUp = () => {
  const isSignedIn = useContext(IsSignedInContext);
  const config = useConfig();
  const router = useRouter();
  if (isSignedIn) {
    router.replace("/");
  } else if (config.DISABLE_REGISTRATION) {
    router.replace("/auth/signIn");
  } else {
    return (
      <>
        <Meta title="Sign Up" />
        <AuthForm mode="signUp" />
      </>
    );
  }
};
export default SignUp;
