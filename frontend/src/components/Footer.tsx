import { Anchor, Center, Footer as MFooter, Text } from "@mantine/core";

const Footer = () => {
  return (
    <MFooter height="auto" p={10}>
      <Center>
        <Text size="xs" color="dimmed">
          Made with 🖤 by{" "}
          <Anchor size="xs" href="https://eliasschneider.com" target="_blank">
            Elias Schneider
          </Anchor>
        </Text>
      </Center>
    </MFooter>
  );
};

export default Footer;
