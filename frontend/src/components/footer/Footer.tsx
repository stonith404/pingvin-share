import { Anchor, Footer as MFooter, SimpleGrid, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useConfig from "../../hooks/config.hook";
import useTranslate from "../../hooks/useTranslate.hook";

const Footer = () => {
  const t = useTranslate();
  const config = useConfig();
  const hasImprint = !!(
    config.get("legal.imprintUrl") || config.get("legal.imprintText")
  );
  const hasPrivacy = !!(
    config.get("legal.privacyPolicyUrl") ||
    config.get("legal.privacyPolicyText")
  );
  const imprintUrl =
    (!config.get("legal.imprintText") && config.get("legal.imprintUrl")) ||
    "/imprint";
  const privacyUrl =
    (!config.get("legal.privacyPolicyText") &&
      config.get("legal.privacyPolicyUrl")) ||
    "/privacy";

  const isMobile = useMediaQuery("(max-width: 700px)");

  return (
    <MFooter height="auto" py={6} px="xl" zIndex={100}>
      <SimpleGrid cols={isMobile ? 2 : 3} m={0}>
        {!isMobile && <div></div>}
        <Text size="xs" color="dimmed" align={isMobile ? "left" : "center"}>
          Powered by{" "}
          <Anchor
            size="xs"
            href="https://github.com/stonith404/pingvin-share"
            target="_blank"
          >
            Pingvin Share
          </Anchor>
        </Text>
        <div>
          {config.get("legal.enabled") && (
            <Text size="xs" color="dimmed" align="right">
              {hasImprint && (
                <Anchor size="xs" href={imprintUrl}>
                  {t("imprint.title")}
                </Anchor>
              )}
              {hasImprint && hasPrivacy && " • "}
              {hasPrivacy && (
                <Anchor size="xs" href={privacyUrl}>
                  {t("privacy.title")}
                </Anchor>
              )}
            </Text>
          )}
        </div>
      </SimpleGrid>
    </MFooter>
  );
};

export default Footer;
