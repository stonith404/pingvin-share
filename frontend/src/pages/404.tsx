import {
  Button,
  Container,
  createStyles,
  Group,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import Meta from "../components/Meta";

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
    marginBottom: `calc(${theme.spacing.xl} * 100)`,
    color: theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 120,
    },
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginBottom: `calc(${theme.spacing.xl} * 100)`,
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
          抱歉，此页面不存在.
        </Title>
        <Text
          color="dimmed"
          align="center"
          className={classes.description}
        ></Text>
        <Group position="center">
          <Button component={Link} href="/" variant="light">
            带我回去
          </Button>
        </Group>
      </Container>
    </>
  );
};
export default ErrorNotFound;
