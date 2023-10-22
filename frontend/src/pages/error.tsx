import React from "react";
import { Button, createStyles, Stack, Text, Title } from "@mantine/core";
import Meta from "../components/Meta";
import useTranslate from "../hooks/useTranslate.hook";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";

const useStyle = createStyles({
  title: {
    fontSize: 100,
  },
});

export default function Error() {
  const { classes } = useStyle();
  const t = useTranslate();
  const router = useRouter();

  const params = router.query.params
    ? (router.query.params as string).split(",").map((param) => {
        return t(`error.param.${param}`);
      })
    : [];

  return (
    <>
      <Meta title={t("error.title")} />
      <Stack align="center">
        <Title order={3} className={classes.title}>
          {t("error.description")}
        </Title>
        <Text mt="xl" size="lg">
          <FormattedMessage
            id={`error.msg.${router.query.error || "default"}`}
            values={Object.fromEntries(
              [params].map((value, key) => [key.toString(), value]),
            )}
          />
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
