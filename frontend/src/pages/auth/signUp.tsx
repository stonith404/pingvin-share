import getConfig from "next/config";
import { useRouter } from "next/router";
import AuthForm from "../../components/auth/AuthForm";
import Meta from "../../components/Meta";
import useUser from "../../hooks/user.hook";

const { publicRuntimeConfig } = getConfig();

const SignUp = () => {
  const user = useUser();
  const router = useRouter();
  if (user) {
    router.replace("/");
  } else if (publicRuntimeConfig.ALLOW_REGISTRATION == "false") {
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
