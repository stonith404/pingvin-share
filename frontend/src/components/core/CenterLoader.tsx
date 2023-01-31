import { Center, Loader, Stack } from "@mantine/core";

const CenterLoader = () => {
  return (
    <Center style={{ height: "70vh" }}>
      <Stack align="center" spacing={10}>
        <Loader />
      </Stack>
    </Center>
  );
};

export default CenterLoader;
