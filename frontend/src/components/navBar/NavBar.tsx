import {
  Box,
  Burger,
  Container,
  createStyles,
  Group,
  Header,
  Image,
  Paper,
  Stack,
  Text,
  Transition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import getConfig from "next/config";
import { ReactNode, useEffect, useState } from "react";
import useUser from "../../hooks/user.hook";
import ActionAvatar from "./ActionAvatar";

const { publicRuntimeConfig } = getConfig();

const HEADER_HEIGHT = 60;

type Link = {
  link?: string;
  label?: string;
  component?: ReactNode;
  action?: () => Promise<void>;
};

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
    },
  },
}));

const NavBar = () => {
  const user = useUser();
  const [opened, toggleOpened] = useDisclosure(false);

  const authenticatedLinks = [
    {
      link: "/upload",
      label: "Upload",
    },
    {
      component: <ActionAvatar />,
    },
  ];

  const [unauthenticatedLinks, setUnauthenticatedLinks] = useState<Link[]>([
    {
      link: "/auth/signIn",
      label: "Sign in",
    },
  ]);

  useEffect(() => {
    if (publicRuntimeConfig.SHOW_HOME_PAGE == "true")
      setUnauthenticatedLinks((array) => [
        {
          link: "/",
          label: "Home",
        },
        ...array,
      ]);

    if (publicRuntimeConfig.ALLOW_REGISTRATION == "true")
      setUnauthenticatedLinks((array) => [
        ...array,
        {
          link: "/auth/signUp",
          label: "Sign up",
        },
      ]);
  }, []);

  const { classes, cx } = useStyles();
  const items = (
    <>
      {(user ? authenticatedLinks : unauthenticatedLinks).map((link) => {
        if (link.component) {
          return (
            <>
              <Box pl={5} py={15}>
                {link.component}
              </Box>
            </>
          );
        }
        return (
          <NextLink
            key={link.label}
            href={link.link ?? ""}
            onClick={() => toggleOpened.toggle()}
            className={cx(classes.link, {
              [classes.linkActive]: window.location.pathname == link.link,
            })}
          >
            {link.label}
          </NextLink>
        );
      })}
    </>
  );
  return (
    <Header height={HEADER_HEIGHT} mb={40} className={classes.root}>
      <Container className={classes.header}>
        <NextLink href="/">
          <Group>
            <Image
              src="/img/logo.svg"
              alt="Pinvgin Share Logo"
              height={35}
              width={35}
            />
            <Text weight={600}>Pingvin Share</Text>
          </Group>
        </NextLink>
        <Group spacing={5} className={classes.links}>
          <Group>{items} </Group>
        </Group>
        <Burger
          opened={opened}
          onClick={() => toggleOpened.toggle()}
          className={classes.burger}
          size="sm"
        />
        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              <Stack spacing={0}> {items}</Stack>
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
};

export default NavBar;
