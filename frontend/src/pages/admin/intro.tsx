import {
  Anchor,
  Button,
  Center,
  Container,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import Logo from "../../components/Logo";
import Meta from "../../components/Meta";

const Intro = () => {
  return (
    <>
      <Meta title="介绍" />
      <Container size="xs">
        <Stack>
          <Center>
            <Logo height={80} width={80} />
          </Center>
          <Center>
            <Title order={2}>欢迎来到 Pingvin Share</Title>
          </Center>
          <Text>
            如果你喜欢 Pingvin Share ，请 ⭐️ 打开{" "}
            <Anchor
              target="_blank"
              href="https://github.com/stonith404/pingvin-share"
            >
              GitHub
            </Anchor>{" "}
            或{" "}
            <Anchor
              target="_blank"
              href="https://github.com/sponsors/stonith404"
            >
              给我买杯咖啡
            </Anchor>{" "}
            如果你想支持我的工作.
          </Text>
          <Text>聊得够多了，与 Pingvin Share 一起玩得开心！</Text>
          <Text mt="lg">你想如何继续？</Text>
          <Stack>
            <Button href="/admin/config/general" component={Link}>
              自定义配置
            </Button>
            <Button href="/" component={Link} variant="light">
              探索 Pingvin Share
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export default Intro;
