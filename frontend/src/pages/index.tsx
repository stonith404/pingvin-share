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
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { TbCheck } from "react-icons/tb";
import Logo from "../components/Logo";
import Meta from "../components/Meta";
import useUser from "../hooks/user.hook";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: `calc(${theme.spacing.md} * 4)`,
    paddingBottom: `calc(${theme.spacing.md} * 4)`,
  },

  content: {
    maxWidth: 480,
    marginRight: `calc(${theme.spacing.md} * 3)`,

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
  const { classes } = useStyles();
  const { refreshUser } = useUser();
  const router = useRouter();

  // If the user is already logged in, redirect to the upload page
  useEffect(() => {
    refreshUser().then((user) => {
      if (user) {
        router.replace("/upload");
      }
    });
  }, []);

  return (
    <>
      <Meta title="主页" />
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              一个 <span className={classes.highlight}>自托管的</span> <br />{" "}
              文件共享平台.
            </Title>
            <Text color="dimmed" mt="md">
              你真的想把你的个人档案交给WeTransfer等第三方?
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
                  <b>自托管</b> - 在您自己的机器上搭建 Pingvin share.
                </div>
              </List.Item>
              <List.Item>
                <div>
                  <b>隐私</b> - 你的文件就是你的文件，永远不应该落入第三方手中.
                </div>
              </List.Item>
              <List.Item>
                <div>
                  <b>没有恼人的文件大小限制</b> - 上传你想要的的文件大小。只有你的硬盘容量才是你的极限.
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
                开始使用
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
                Github源码
              </Button>
            </Group>
          </div>
          <Group className={classes.image} align="center">
            <Logo width={200} height={200} />
          </Group>
        </div>
      </Container>
    </>
  );
}
