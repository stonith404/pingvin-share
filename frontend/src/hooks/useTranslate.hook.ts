import { getCookie } from "cookies-next";
import { createIntl, createIntlCache, useIntl } from "react-intl";
import { messages } from "../i18n/messages";

const useTranslate = () => {
  const intl = useIntl();
  return (
    id: string,
    values?: Parameters<typeof intl.formatMessage>[1],
    opts?: Parameters<typeof intl.formatMessage>[2]
  ) => {
    return intl.formatMessage({ id }, values, opts) as string;
  };
};

const cache = createIntlCache();

export const translateOutsideContext = () => {
  const locale =
    getCookie("language")?.toString() ?? navigator.language.split("-")[0];

  const intl = createIntl(
    {
      locale,
      messages: messages[locale],
      defaultLocale: "en",
    },
    cache
  );
  return (
    id: string,
    values?: Parameters<typeof intl.formatMessage>[1],
    opts?: Parameters<typeof intl.formatMessage>[2]
  ) => {
    return intl.formatMessage({ id }, values, opts) as string;
  };
};

export default useTranslate;
