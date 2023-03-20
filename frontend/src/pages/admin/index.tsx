import {
  Center,
  Col,
  createStyles,
  Grid,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TbRefresh, TbSettings, TbUsers } from "react-icons/tb";
import Meta from "../../components/Meta";
import configService from "../../services/config.service";
import {FormattedMessage} from "react-intl";
import {useIntl} from "react-intl";

const useStyles = createStyles((theme) => ({
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    height: 90,
    "&:hover": {
      boxShadow: `${theme.shadows.sm} !important`,
      transform: "scale(1.01)",
    },
  },
}));

const Admin = () => {
  const { classes, theme } = useStyles();
  const intl = useIntl();

  const [managementOptions, setManagementOptions] = useState([
    {
      title: intl.formatMessage({id:"admin.button.users"}),
      icon: TbUsers,
      route: "/admin/users",
    },
    {
      title: intl.formatMessage({id:"admin.button.config"}),
      icon: TbSettings,
      route: "/admin/config/general",
    },
  ]);

  useEffect(() => {
    configService.isNewReleaseAvailable().then((isNewReleaseAvailable) => {
      if (isNewReleaseAvailable) {
        setManagementOptions([
          ...managementOptions,
          {
            title: "Update",
            icon: TbRefresh,
            route:
              "https://github.com/stonith404/pingvin-share/releases/latest",
          },
        ]);
      }
    });
  }, []);

  return (
    <>
      <Meta title={intl.formatMessage({id:"admin.title"})} />
      <Title mb={30} order={3}>
        <FormattedMessage id="admin.title" />
      </Title>
      <Stack justify="space-between" style={{ height: "calc(100vh - 180px)" }}>
        <Paper withBorder p={40}>
          <Grid>
            {managementOptions.map((item) => {
              return (
                <Col xs={6} key={item.route}>
                  <Paper
                    withBorder
                    component={Link}
                    href={item.route}
                    key={item.title}
                    className={classes.item}
                  >
                    <item.icon color={theme.colors.victoria[8]} size={35} />
                    <Text mt={7}>{item.title}</Text>
                  </Paper>
                </Col>
              );
            })}
          </Grid>
        </Paper>

        <Center>
          <Text size="xs" color="dimmed">
            <FormattedMessage id="admin.version" /> {process.env.VERSION}
          </Text>
        </Center>
      </Stack>
    </>
  );
};

export default Admin;
