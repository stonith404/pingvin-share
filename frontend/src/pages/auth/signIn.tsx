import { useRouter } from "next/router";
import SignInForm from "../../components/auth/SignInForm";
import Meta from "../../components/Meta";
import useUser from "../../hooks/user.hook";

const SignIn = () => {
  const { user } = useUser();
  const router = useRouter();
  if (user) {
    router.replace("/");
  } else {
    return (
      <>
        <Meta title="Sign In" />
        <SignInForm />
      </>
    );
  }
};
export default SignIn;
