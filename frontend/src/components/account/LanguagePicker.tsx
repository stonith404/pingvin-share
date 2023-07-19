import { Select } from "@mantine/core";
import { getCookie, setCookie } from "cookies-next";
import { useState } from "react";
import { LOCALES } from "../../i18n/locales";

const LanguagePicker = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    getCookie("language")?.toString()
  );

  const languages = Object.values(LOCALES).map((locale) => ({
    value: locale.code,
    label: locale.name,
  }));
  return (
    <Select
      value={selectedLanguage}
      onChange={(value) => {
        setSelectedLanguage(value ?? "en");
        setCookie("language", value, {
          sameSite: "lax",
          expires: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
        });
        location.reload();
      }}
      data={languages}
    />
  );
};

export default LanguagePicker;
