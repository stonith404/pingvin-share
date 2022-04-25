import {
  Button,
  Container,
  createStyles,
  Group,
  List,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { Check } from "tabler-icons-react";
import { IsSignedInContext } from "../utils/auth.util";
import Image from "next/image";
const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.55)
        : theme.colors[theme.primaryColor][0],
    borderRadius: theme.radius.sm,
    padding: "4px 12px",
  },
}));

export default function Home() {
  const isSignedIn = useContext(IsSignedInContext);
  const { classes } = useStyles();
  const router = useRouter();
  if (isSignedIn) {
    router.replace("/upload");
  } else {
    return (
      <div>
        <Container>
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                A <span className={classes.highlight}>self-hosted</span> <br />{" "}
                file sharing platform.
              </Title>
              <Text color="dimmed" mt="md">
                Do you really want to give your personal files in the hand of
                third parties like WeTransfer?
              </Text>

              <List
                mt={30}
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon size={20} radius="xl">
                    <Check size={12} />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  <b>Self-Hosted</b> - Host Pingvin Share on your own machine.
                </List.Item>
                <List.Item>
                  <b>Privacy</b> - Your files are your files and should never
                  get into the hands of third parties.
                </List.Item>
                <List.Item>
                  <b>No annoying file size limit</b> - Upload as big files as
                  you want. Only your hard drive will be your limit.
                </List.Item>
              </List>

              <Group mt={30}>
                <Button
                  component={NextLink}
                  href="/auth/signUp"
                  radius="xl"
                  size="md"
                  className={classes.control}
                >
                  Get started
                </Button>
                <Button
                  component={NextLink}
                  href="https://github.com/stonith404/pingvin-share"
                  target="_blank"
                  variant="default"
                  radius="xl"
                  size="md"
                  className={classes.control}
                >
                  Source code
                </Button>
              </Group>
            </div>
            <Image
              src="/logo.svg"
              alt="Pingvin Share Logo"
              width={200}
              height={200}
              className={classes.image}
            />
          </div>
        </Container>
      </div>
    );
  }
}
