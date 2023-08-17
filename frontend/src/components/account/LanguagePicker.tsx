import { Select } from "@mantine/core";
import { getCookie, setCookie } from "cookies-next";
import { useState } from "react";
import useTranslate from "../../hooks/useTranslate.hook";
import { LOCALES } from "../../i18n/locales";

const LanguagePicker = () => {
  const t = useTranslate();
  const [selectedLanguage, setSelectedLanguage] = useState(
    getCookie("language")?.toString(),
  );

  const languages = Object.values(LOCALES).map((locale) => ({
    value: locale.code,
    label: locale.name,
  }));
  return (
    <Select
      value={selectedLanguage}
      description={t("account.card.language.description")}
      onChange={(value) => {
        setSelectedLanguage(value ?? "en");
        setCookie("language", value, {
          sameSite: "lax",
          expires: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ),
        });
        location.reload();
      }}
      data={languages}
    />
  );
};

export default LanguagePicker;
