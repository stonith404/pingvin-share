import { useRouter } from "next/router";
import AuthForm from "../../components/auth/AuthForm";
import Meta from "../../components/Meta";
import useUser from "../../hooks/user.hook";

const SignIn = () => {
  const user = useUser();
  const router = useRouter();
  if (user) {
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
