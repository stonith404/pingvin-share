import React from "react";
import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  Group,
} from "@mantine/core";
import Meta from "../components/Meta";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 120,
    },
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

const ErrorNotFound = () => {
  const { classes } = useStyles();

  return (
    <>
      <Meta title="Not found" />
      <Container className={classes.root}>
        <div className={classes.label}>404</div>
        <Title align="center" order={3}>
          Oops this page doesn't exist.
        </Title>
        <Text
          color="dimmed"
          align="center"
          className={classes.description}
        ></Text>
        <Group position="center">
          <Button component={Link} href="/" variant="light">
            Bring me back
          </Button>
        </Group>
      </Container>
    </>
  );
};
export default ErrorNotFound;
