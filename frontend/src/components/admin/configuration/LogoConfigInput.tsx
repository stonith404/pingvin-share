import { Box, FileInput, Group, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Dispatch, SetStateAction } from "react";
import { TbUpload } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import useTranslate from "../../../hooks/useTranslate.hook";

const LogoConfigInput = ({
  logo,
  setLogo,
}: {
  logo: File | null;
  setLogo: Dispatch<SetStateAction<File | null>>;
}) => {
  const isMobile = useMediaQuery("(max-width: 560px)");
  const t = useTranslate();

  return (
    <Group position="apart">
      <Stack style={{ maxWidth: isMobile ? "100%" : "40%" }} spacing={0}>
        <Title order={6}>
          <FormattedMessage id="admin.config.general.logo" />
        </Title>
        <Text color="dimmed" size="sm" mb="xs">
          <FormattedMessage id="admin.config.general.logo.description" />
        </Text>
      </Stack>
      <Stack></Stack>
      <Box style={{ width: isMobile ? "100%" : "50%" }}>
        <FileInput
          clearable
          icon={<TbUpload size={14} />}
          value={logo}
          onChange={(v) => setLogo(v)}
          accept=".png"
          placeholder={t("admin.config.general.logo.placeholder")}
        />
      </Box>
    </Group>
  );
};

export default LogoConfigInput;
