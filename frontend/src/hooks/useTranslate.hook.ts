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
  const intl = createIntl(
    {
      locale: "en",
      messages: messages["en"],
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
