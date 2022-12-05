import { useRouter } from "next/router";
import SignUpForm from "../../components/auth/SignUpForm";
import Meta from "../../components/Meta";
import useConfig from "../../hooks/config.hook";
import useUser from "../../hooks/user.hook";

const SignUp = () => {
  const config = useConfig();
  const user = useUser();
  const router = useRouter();
  if (user) {
    router.replace("/");
  } else if (config.get("ALLOW_REGISTRATION") == "false") {
    router.replace("/auth/signIn");
  } else {
    return (
      <>
        <Meta title="Sign Up" />
        <SignUpForm />
      </>
    );
  }
};
export default SignUp;
