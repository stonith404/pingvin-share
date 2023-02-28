import {
  AppShell,
  Box,
  Burger,
  Button,
  Container,
  createStyles,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Space,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TbAt, TbColorSwatch, TbMail, TbShare, TbSquare } from "react-icons/tb";
import AdminConfigInput from "../../../components/admin/configuration/AdminConfigInput";
import Logo from "../../../components/Logo";
import useConfig from "../../../hooks/config.hook";
import configService from "../../../services/config.service";
import { AdminConfig, UpdateConfig } from "../../../types/config.type";
import { configVariableToFriendlyName } from "../../../utils/string.util";
import toast from "../../../utils/toast.util";

const categories = [
  { name: "Branding", icon: <TbColorSwatch /> },
  { name: "General", icon: <TbSquare /> },
  { name: "Email", icon: <TbMail /> },
  { name: "Share", icon: <TbShare /> },
  { name: "SMTP", icon: <TbAt /> },
];

const useStyles = createStyles((theme) => ({
  activeLink: {
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.primaryColor,
    }).background,
    color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
      .color,

    borderRadius: theme.radius.sm,
    fontWeight: 600,
  },
}));

export default function AppShellDemo() {
  const theme = useMantineTheme();
  const router = useRouter();
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 560px)");
  const config = useConfig();

  const { category: categoryId } = router.query;

  const [configVariables, setConfigVariables] = useState<AdminConfig[]>([]);
  const [updatedConfigVariables, setUpdatedConfigVariables] = useState<
    UpdateConfig[]
  >([]);

  const saveConfigVariables = async () => {
    if (config.get("internal.setupStatus") == "REGISTERED") {
      await configService
        .updateMany(updatedConfigVariables)
        .then(async () => {
          await configService.finishSetup();
          router.reload();
        })
        .catch(toast.axiosError);
    } else {
      await configService
        .updateMany(updatedConfigVariables)
        .then(() => {
          setUpdatedConfigVariables([]);
          toast.success("Configurations updated successfully");
        })
        .catch(toast.axiosError);
    }
    config.refresh();
  };

  const updateConfigVariable = (configVariable: UpdateConfig) => {
    const index = updatedConfigVariables.findIndex(
      (item) => item.key === configVariable.key
    );
    if (index > -1) {
      updatedConfigVariables[index] = configVariable;
    } else {
      setUpdatedConfigVariables([...updatedConfigVariables, configVariable]);
    }
  };

  useEffect(() => {
    configService
      .getByCategory(categoryId as string)
      .then((configVariables) => {
        setConfigVariables(configVariables);
      });
  }, [categoryId]);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section>
            <Text size="xs" color="dimmed" mb="sm">
              Configuration
            </Text>
            <Stack spacing="xs">
              {categories.map((category) => (
                <Box
                  p="xs"
                  component={Link}
                  className={
                    categoryId == category.name.toLowerCase()
                      ? classes.activeLink
                      : undefined
                  }
                  key={category.name}
                  href={`/admin/config/${category.name.toLowerCase()}`}
                >
                  <Group>
                    <ThemeIcon variant="light">{category.icon}</ThemeIcon>
                    <Text size="sm">{category.name}</Text>
                  </Group>
                </Box>
              ))}
            </Stack>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Group position="apart" w="100%">
              <Link href="/" passHref>
                <Group>
                  <Logo height={35} width={35} />
                  <Text weight={600}>{config.get("general.appName")}</Text>
                </Group>
              </Link>
              <Button variant="light" component={Link} href="/">
                Go back
              </Button>
            </Group>
          </div>
        </Header>
      }
    >
      <Container size="lg">
        {configVariables.map((configVariable) => (
          <>
            <Group position="apart">
              <Stack
                style={{ maxWidth: isMobile ? "100%" : "40%" }}
                spacing={0}
              >
                <Title order={6}>
                  {configVariableToFriendlyName(configVariable.name)}
                </Title>
                <Text color="dimmed" size="sm" mb="xs">
                  {configVariable.description}
                </Text>
              </Stack>
              <Stack></Stack>
              <Box style={{ width: isMobile ? "100%" : "50%" }}>
                <AdminConfigInput
                  key={configVariable.key}
                  configVariable={configVariable}
                  updateConfigVariable={updateConfigVariable}
                />
              </Box>
            </Group>

            <Space h="lg" />
          </>
        ))}
        <Button onClick={saveConfigVariables}>Save</Button>
      </Container>
    </AppShell>
  );
}
