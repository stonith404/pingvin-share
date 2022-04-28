import { useRouter } from "next/router";
import React, { useContext } from "react";
import AuthForm from "../../components/auth/AuthForm";
import Meta from "../../components/Meta";
import { IsSignedInContext } from "../../utils/auth.util";

const SignIn = () => {
  const isSignedIn = useContext(IsSignedInContext);
  const router = useRouter();
  if (isSignedIn) {
    router.replace("/");
  } else {
    return (
      <>
        <Meta title="Sign In" />
        <AuthForm mode="signIn" />
      </>
    );
  }
};
export default SignIn;
