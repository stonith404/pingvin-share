import SignUpForm from "../../components/auth/SignUpForm";
import Meta from "../../components/Meta";
import useTranslate from "../../hooks/useTranslate.hook";

const SignUp = () => {
  const t = useTranslate();
  return (
    <>
      <Meta title={t("signup.title")} />
      <SignUpForm />
    </>
  );
};
export default SignUp;
