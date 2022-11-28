import { useRouter } from "next/router";
import AuthForm from "../../components/auth/AuthForm";
import Meta from "../../components/Meta";
import useConfig from "../../hooks/config.hook";
import useUser from "../../hooks/user.hook";

const SignUp = () => {
  const config = useConfig();
  const user = useUser();
  const router = useRouter();
  if (user) {
    router.replace("/");
  } else if (config.get("allowRegistration") == "false") {
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
