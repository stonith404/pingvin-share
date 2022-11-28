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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { TbCheck } from "react-icons/tb";
import Meta from "../components/Meta";
import useConfig from "../hooks/config.hook";
import useUser from "../hooks/user.hook";

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
  const config = useConfig();
  const user = useUser();

  const { classes } = useStyles();
  const router = useRouter();
  if (user || config.get("allowUnauthenticatedShares")) {
    router.replace("/upload");
  } else if (!config.get("showHomePage")) {
    router.replace("/auth/signIn");
  } else {
    return (
      <>
        <Meta title="Home" />
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
                    <TbCheck size={12} />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  <div>
                    <b>Self-Hosted</b> - Host Pingvin Share on your own machine.
                  </div>
                </List.Item>
                <List.Item>
                  <div>
                    <b>Privacy</b> - Your files are your files and should never
                    get into the hands of third parties.
                  </div>
                </List.Item>
                <List.Item>
                  <div>
                    <b>No annoying file size limit</b> - Upload as big files as
                    you want. Only your hard drive will be your limit.
                  </div>
                </List.Item>
              </List>

              <Group mt={30}>
                <Button
                  component={Link}
                  href="/auth/signUp"
                  radius="xl"
                  size="md"
                  className={classes.control}
                >
                  Get started
                </Button>
                <Button
                  component={Link}
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
            <Group className={classes.image} align="center">
              <Image
                src="/img/logo.svg"
                alt="Pingvin Share Logo"
                width={200}
                height={200}
              />
            </Group>
          </div>
        </Container>
      </>
    );
  }
}
