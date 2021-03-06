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
import Image from "next/image";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import headerStyle from "../../styles/header.style";
import { IsSignedInContext } from "../../utils/auth.util";
import { useConfig } from "../../utils/config.util";
import ActionAvatar from "./ActionAvatar";

type Link = {
  link?: string;
  label?: string;
  component?: ReactNode;
  action?: () => Promise<void>;
};

const Header = () => {
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [active, setActive] = useState<string>();
  const isSignedIn = useContext(IsSignedInContext);
  const config = useConfig();
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

  if (!config.DISABLE_HOME_PAGE)
    unauthenticatedLinks.unshift({
      link: "/",
      label: "Home",
    });

  if (!config.DISABLE_REGISTRATION)
    unauthenticatedLinks.push({
      link: "/auth/signUp",
      label: "Sign up",
    });

  const links = isSignedIn ? authenticatedLinks : unauthenticatedLinks;

  const items = links.map((link) => {
    if (link.component) {
      return (
        <>
          <Container pl={5} py={15}>
            {link.component}
          </Container>
        </>
      );
    }
    if (link) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (window.location.pathname == link.link) {
          setActive(link.link);
        }
      });
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
