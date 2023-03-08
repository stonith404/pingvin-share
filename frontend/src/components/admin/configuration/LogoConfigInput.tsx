import { Box, FileInput, Group, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Dispatch, SetStateAction } from "react";
import { TbUpload } from "react-icons/tb";

const LogoConfigInput = ({
  logo,
  setLogo,
}: {
  logo: File | null;
  setLogo: Dispatch<SetStateAction<File | null>>;
}) => {
  const isMobile = useMediaQuery("(max-width: 560px)");

  return (
    <Group position="apart">
      <Stack style={{ maxWidth: isMobile ? "100%" : "40%" }} spacing={0}>
        <Title order={6}>Logo</Title>
        <Text color="dimmed" size="sm" mb="xs">
          Change your logo by uploading a new image. The image must be a PNG and
          should have the format 1:1.
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
          placeholder="Pick image"
        />
      </Box>
    </Group>
  );
};

export default LogoConfigInput;
