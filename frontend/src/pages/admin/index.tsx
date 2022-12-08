import { Col, createStyles, Grid, Paper, Text } from "@mantine/core";
import Link from "next/link";
import { TbSettings, TbUsers } from "react-icons/tb";

const managementOptions = [
  {
    title: "User management",
    icon: TbUsers,
    route: "/admin/users",
  },
  {
    title: "Configuration",
    icon: TbSettings,
    route: "/admin/config",
  },
];

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

  return (
    <Paper withBorder p={40}>
      <Grid mt="md">
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
  );
};

export default Admin;
