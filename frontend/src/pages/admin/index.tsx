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

  const [managementOptions, setManagementOptions] = useState([
    {
      title: "User management",
      icon: TbUsers,
      route: "/admin/users",
    },
    {
      title: "Configuration",
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
      <Meta title="Administration" />
      <Title mb={30} order={3}>
        Administration
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
            Version {process.env.VERSION}
          </Text>
        </Center>
      </Stack>
    </>
  );
};

export default Admin;
