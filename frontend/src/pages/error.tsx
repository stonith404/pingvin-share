import React from "react";
import { Button, createStyles, Stack, Text, Title } from "@mantine/core";
import Meta from "../components/Meta";
import useTranslate from "../hooks/useTranslate.hook";
import { useRouter } from "next/router";

const useStyle = createStyles({
  title: {
    fontSize: 100,
  },
});

export default function Error() {
  const { classes } = useStyle();
  const t = useTranslate();
  const router = useRouter();
  return (
    <>
      <Meta title="Error" />
      <Stack align="center">
        <Title order={3} className={classes.title}>
          {t("error.description")}
        </Title>
        <Text mt="xl" size="lg">
          {t(`error.msg.${router.query.msg || "default"}`)}
        </Text>
        <Button
          mt="xl"
          onClick={() => router.push((router.query.redirect as string) || "/")}
        >
          {t("error.button.back")}
        </Button>
      </Stack>
    </>
  );
}
