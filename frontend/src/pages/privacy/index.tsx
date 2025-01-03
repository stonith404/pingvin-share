import { Anchor, Title, useMantineTheme } from "@mantine/core";
import Meta from "../../components/Meta";
import useTranslate from "../../hooks/useTranslate.hook";
import { FormattedMessage } from "react-intl";
import useConfig from "../../hooks/config.hook";
import Markdown from "markdown-to-jsx";

const PrivacyPolicy = () => {
  const t = useTranslate();
  const { colorScheme } = useMantineTheme();
  const config = useConfig();
  return (
    <>
      <Meta title={t("privacy.title")} />
      <Title mb={30} order={1}>
        <FormattedMessage id="privacy.title" />
      </Title>
      <Markdown
        options={{
          forceBlock: true,
          overrides: {
            pre: {
              props: {
                style: {
                  backgroundColor:
                    colorScheme == "dark"
                      ? "rgba(50, 50, 50, 0.5)"
                      : "rgba(220, 220, 220, 0.5)",
                  padding: "0.75em",
                  whiteSpace: "pre-wrap",
                },
              },
            },
            table: {
              props: {
                className: "md",
              },
            },
            a: {
              props: {
                target: "_blank",
                rel: "noreferrer",
              },
              component: Anchor,
            },
          },
        }}
      >
        {config.get("legal.privacyPolicyText")}
      </Markdown>
    </>
  );
};

export default PrivacyPolicy;
