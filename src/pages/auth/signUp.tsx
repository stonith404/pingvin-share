import { useRouter } from "next/router";
import React, { useContext } from "react";
import AuthForm from "../../components/auth/AuthForm";
import { IsSignedInContext } from "../../utils/auth.util";

const SignUp = () => {
  const isSignedIn = useContext(IsSignedInContext);
  const router = useRouter();
  if (isSignedIn) {
    router.replace("/");
  } else {
    return <AuthForm mode="signUp" />;
  }
};
export default SignUp;
