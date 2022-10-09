import {
  Burger,
  Container,
  Group,
  Header as MantineHeader,
  Paper,
  Text,
  Transition,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import getConfig from "next/config";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import useUser from "../../hooks/user.hook";
import headerStyle from "../../styles/header.style";
import ActionAvatar from "./ActionAvatar";

const { publicRuntimeConfig } = getConfig();

type Link = {
  link?: string;
  label?: string;
  component?: ReactNode;
  action?: () => Promise<void>;
};

const Header = () => {
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [active, setActive] = useState<string>();
  const user = useUser();

  const { classes, cx } = headerStyle();

  const authenticatedLinks: Link[] = [
    {
      link: "/upload",
      label: "Upload",
    },
    {
      component: <ActionAvatar />,
    },
  ];

  const unauthenticatedLinks: Link[] | undefined = [
    {
      link: "/auth/signIn",
      label: "Sign in",
    },
  ];

  if (publicRuntimeConfig.SHOW_HOME_PAGE == "true")
    unauthenticatedLinks.unshift({
      link: "/",
      label: "Home",
    });

  if (publicRuntimeConfig.ALLOW_REGISTRATION == "true")
    unauthenticatedLinks.push({
      link: "/auth/signUp",
      label: "Sign up",
    });

  const links = user ? authenticatedLinks : unauthenticatedLinks;

  const items = links.map((link, i) => {
    if (link.component) {
      return (
        <Container key={i} pl={5} py={15}>
          {link.component}
        </Container>
      );
    }
    if (link) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (window.location.pathname == link.link) {
          setActive(link.link);
        }
      }, []);
      return (
        <NextLink
          key={link.label}
          href={link.link ?? ""}
          onClick={link.action}
          className={cx(classes.link, {
            [classes.linkActive]: link.link && active === link.link,
          })}
        >
          {link.label}
        </NextLink>
      );
    }
  });

  return (
    <MantineHeader height={60} mb={20} className={classes.root}>
      <Container className={classes.header}>
        <NextLink href="/">
          <Group>
            <Image
              src="/img/logo.svg"
              alt="Pinvgin Share Logo"
              height={40}
              width={40}
            />
            <Text weight={600}>Pingvin Share</Text>
          </Group>
        </NextLink>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </MantineHeader>
  );
};
export default Header;
