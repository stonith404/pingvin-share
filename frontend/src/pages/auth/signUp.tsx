import { useRouter } from "next/router";
import AuthForm from "../../components/auth/AuthForm";
import Meta from "../../components/Meta";
import useUser from "../../hooks/user.hook";

const SignUp = () => {
  const user = useUser();
  const router = useRouter();
  if (user) {
    router.replace("/");
  } else if (process.env.NEXT_PUBLIC_DISABLE_REGISTRATION) {
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
