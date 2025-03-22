import {
  Alert,
  AppShell,
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TbInfoCircle } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import Meta from "../../../components/Meta";
import AdminConfigInput from "../../../components/admin/configuration/AdminConfigInput";
import ConfigurationHeader from "../../../components/admin/configuration/ConfigurationHeader";
import ConfigurationNavBar from "../../../components/admin/configuration/ConfigurationNavBar";
import LogoConfigInput from "../../../components/admin/configuration/LogoConfigInput";
import TestEmailButton from "../../../components/admin/configuration/TestEmailButton";
import CenterLoader from "../../../components/core/CenterLoader";
import useConfig from "../../../hooks/config.hook";
import useTranslate from "../../../hooks/useTranslate.hook";
import configService from "../../../services/config.service";
import { AdminConfig, UpdateConfig } from "../../../types/config.type";
import { camelToKebab } from "../../../utils/string.util";
import toast from "../../../utils/toast.util";

export default function AppShellDemo() {
  const theme = useMantineTheme();
  const router = useRouter();
  const t = useTranslate();

  const [isMobileNavBarOpened, setIsMobileNavBarOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 560px)");
  const config = useConfig();

  const categoryId = (router.query.category as string | undefined) ?? "general";

  const [configVariables, setConfigVariables] = useState<AdminConfig[]>();
  const [updatedConfigVariables, setUpdatedConfigVariables] = useState<
    UpdateConfig[]
  >([]);

  const [logo, setLogo] = useState<File | null>(null);

  const isEditingAllowed = (): boolean => {
    return !configVariables || configVariables[0].allowEdit;
  };

  const saveConfigVariables = async () => {
    if (logo) {
      configService
        .changeLogo(logo)
        .then(() => {
          setLogo(null);
          toast.success(t("admin.config.notify.logo-success"));
        })
        .catch(toast.axiosError);
    }

    if (updatedConfigVariables.length > 0) {
      await configService
        .updateMany(updatedConfigVariables)
        .then(() => {
          setUpdatedConfigVariables([]);
          toast.success(t("admin.config.notify.success"));
        })
        .catch(toast.axiosError);
      void config.refresh();
    } else {
      toast.success(t("admin.config.notify.no-changes"));
    }
  };

  const updateConfigVariable = (configVariable: UpdateConfig) => {
    if (configVariable.key === "general.appUrl") {
      configVariable.value = sanitizeUrl(configVariable.value);
    }

    const index = updatedConfigVariables.findIndex(
      (item) => item.key === configVariable.key,
    );

    if (index > -1) {
      updatedConfigVariables[index] = {
        ...updatedConfigVariables[index],
        ...configVariable,
      };
    } else {
      setUpdatedConfigVariables([...updatedConfigVariables, configVariable]);
    }
  };

  const sanitizeUrl = (url: string): string => {
    return url.endsWith("/") ? url.slice(0, -1) : url;
  };

  useEffect(() => {
    configService.getByCategory(categoryId).then((configVariables) => {
      setConfigVariables(configVariables);
    });
  }, [categoryId]);

  return (
    <>
      <Meta title={t("admin.config.title")} />
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbar={
          <ConfigurationNavBar
            categoryId={categoryId}
            isMobileNavBarOpened={isMobileNavBarOpened}
            setIsMobileNavBarOpened={setIsMobileNavBarOpened}
          />
        }
        header={
          <ConfigurationHeader
            isMobileNavBarOpened={isMobileNavBarOpened}
            setIsMobileNavBarOpened={setIsMobileNavBarOpened}
          />
        }
      >
        <Container size="lg">
          {!configVariables ? (
            <CenterLoader />
          ) : (
            <>
              <Stack>
                {!isEditingAllowed() && (
                  <Alert
                    mb={"lg"}
                    variant="light"
                    color="primary"
                    title={t("admin.config.config-file-warning.title")}
                    icon={<TbInfoCircle />}
                  >
                    <FormattedMessage id="admin.config.config-file-warning.description" />
                  </Alert>
                )}
                <Title mb="md" order={3}>
                  {t("admin.config.category." + categoryId)}
                </Title>
                {categoryId === "oauth" ? (
                  <>
                    {/* Paramètres OAuth généraux */}
                    <Box
                      mb="xl"
                      style={{
                        border: "1px solid #eee",
                        padding: "1rem",
                        borderRadius: "8px",
                      }}
                    >
                      <Title order={4} mb="xs">
                        {t("admin.config.group.general")}
                      </Title>
                      <Text color="dimmed" size="sm" mb="md">
                        {t("admin.config.group.general.description")}
                      </Text>
                      {configVariables
                        .filter(
                          (config) =>
                            config.key.startsWith("oauth.") &&
                            ![
                              "github",
                              "google",
                              "microsoft",
                              "discord",
                              "oidc",
                            ].some((provider) => config.key.includes(provider)),
                        )
                        .map((configVariable) => (
                          <Group key={configVariable.key} position="apart">
                            <Stack
                              style={{ maxWidth: isMobile ? "100%" : "40%" }}
                              spacing={0}
                            >
                              <Title order={6}>
                                <FormattedMessage
                                  id={`admin.config.${camelToKebab(
                                    configVariable.key,
                                  )}`}
                                />
                              </Title>

                              <Text
                                sx={{
                                  whiteSpace: "pre-line",
                                }}
                                color="dimmed"
                                size="sm"
                                mb="xs"
                              >
                                <FormattedMessage
                                  id={`admin.config.${camelToKebab(
                                    configVariable.key,
                                  )}.description`}
                                  values={{ br: <br /> }}
                                />
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
                        ))}
                    </Box>

                    {/* Providers OAuth */}
                    {["github", "google", "microsoft", "discord", "oidc"].map(
                      (provider) => (
                        <Box
                          key={provider}
                          mb="xl"
                          style={{
                            border: "1px solid #eee",
                            padding: "1rem",
                            borderRadius: "8px",
                          }}
                        >
                          {configVariables
                            .filter((config) =>
                              config.key.startsWith(`oauth.${provider}`),
                            )
                            .map((configVariable) => (
                              <Group key={configVariable.key} position="apart">
                                <Stack
                                  style={{
                                    maxWidth: isMobile ? "100%" : "40%",
                                  }}
                                  spacing={0}
                                >
                                  <Title order={6}>
                                    <FormattedMessage
                                      id={`admin.config.${camelToKebab(
                                        configVariable.key,
                                      )}`}
                                    />
                                  </Title>

                                  <Text
                                    sx={{
                                      whiteSpace: "pre-line",
                                    }}
                                    color="dimmed"
                                    size="sm"
                                    mb="xs"
                                  >
                                    <FormattedMessage
                                      id={`admin.config.${camelToKebab(
                                        configVariable.key,
                                      )}.description`}
                                      values={{ br: <br /> }}
                                    />
                                  </Text>
                                </Stack>
                                <Stack></Stack>
                                <Box
                                  style={{ width: isMobile ? "100%" : "50%" }}
                                >
                                  <AdminConfigInput
                                    key={configVariable.key}
                                    configVariable={configVariable}
                                    updateConfigVariable={updateConfigVariable}
                                  />
                                </Box>
                              </Group>
                            ))}
                        </Box>
                      ),
                    )}
                  </>
                ) : (
                  configVariables.map((configVariable) => (
                    <Group key={configVariable.key} position="apart">
                      <Stack
                        style={{ maxWidth: isMobile ? "100%" : "40%" }}
                        spacing={0}
                      >
                        <Title order={6}>
                          <FormattedMessage
                            id={`admin.config.${camelToKebab(
                              configVariable.key,
                            )}`}
                          />
                        </Title>

                        <Text
                          sx={{
                            whiteSpace: "pre-line",
                          }}
                          color="dimmed"
                          size="sm"
                          mb="xs"
                        >
                          <FormattedMessage
                            id={`admin.config.${camelToKebab(
                              configVariable.key,
                            )}.description`}
                            values={{ br: <br /> }}
                          />
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
                  ))
                )}
                {categoryId == "general" && (
                  <LogoConfigInput logo={logo} setLogo={setLogo} />
                )}
              </Stack>
              <Group mt="lg" position="right">
                {categoryId == "smtp" && (
                  <TestEmailButton
                    configVariablesChanged={updatedConfigVariables.length != 0}
                    saveConfigVariables={saveConfigVariables}
                  />
                )}
                <Button onClick={saveConfigVariables}>
                  <FormattedMessage id="common.button.save" />
                </Button>
              </Group>
            </>
          )}
        </Container>
      </AppShell>
    </>
  );
}
