import useTranslate from "../../../hooks/useTranslate.hook";
import Meta from "../../../components/Meta";
import TotpForm from "../../../components/auth/TotpForm";
import { useRouter } from "next/router";

const Totp = () => {
  const t = useTranslate();
  const router = useRouter()

  return (
    <>
      <Meta title={t("totp.title")} />
      <TotpForm redirectPath={router.query.redirect as string || "/upload"} />
    </>
  );
};

export default Totp;