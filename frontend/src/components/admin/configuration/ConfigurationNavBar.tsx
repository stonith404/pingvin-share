import {
  Box,
  Button,
  createStyles,
  Group,
  MediaQuery,
  Navbar,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import {
  TbAt,
  TbMail,
  TbShare,
  TbSocial,
  TbBucket,
  TbBinaryTree,
  TbSettings,
} from "react-icons/tb";
import { FormattedMessage } from "react-intl";

const categories = [
  { name: "General", icon: <TbSettings /> },
  { name: "Email", icon: <TbMail /> },
  { name: "Share", icon: <TbShare /> },
  { name: "SMTP", icon: <TbAt /> },
  { name: "OAuth", icon: <TbSocial /> },
  { name: "LDAP", icon: <TbBinaryTree /> },
  { name: "S3", icon: <TbBucket /> },
];

const useStyles = createStyles((theme) => ({
  activeLink: {
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.primaryColor,
    }).background,
    color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
      .color,

    borderRadius: theme.radius.sm,
    fontWeight: 600,
  },
}));

const ConfigurationNavBar = ({
  categoryId,
  isMobileNavBarOpened,
  setIsMobileNavBarOpened,
}: {
  categoryId: string;
  isMobileNavBarOpened: boolean;
  setIsMobileNavBarOpened: Dispatch<SetStateAction<boolean>>;
}) => {
  const { classes } = useStyles();
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!isMobileNavBarOpened}
      width={{ sm: 200, lg: 300 }}
    >
      <Navbar.Section>
        <Text size="xs" color="dimmed" mb="sm">
          <FormattedMessage id="admin.config.title" />
        </Text>
        <Stack spacing="xs">
          {categories.map((category) => (
            <Box
              p="xs"
              component={Link}
              onClick={() => setIsMobileNavBarOpened(false)}
              className={
                categoryId == category.name.toLowerCase()
                  ? classes.activeLink
                  : undefined
              }
              key={category.name}
              href={`/admin/config/${category.name.toLowerCase()}`}
            >
              <Group>
                <ThemeIcon
                  variant={
                    categoryId == category.name.toLowerCase()
                      ? "filled"
                      : "light"
                  }
                >
                  {category.icon}
                </ThemeIcon>
                <Text size="sm">
                  <FormattedMessage
                    id={`admin.config.category.${category.name.toLowerCase()}`}
                  />
                </Text>
              </Group>
            </Box>
          ))}
        </Stack>
      </Navbar.Section>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Button mt="xl" variant="light" component={Link} href="/admin">
          <FormattedMessage id="common.button.go-back" />
        </Button>
      </MediaQuery>
    </Navbar>
  );
};

export default ConfigurationNavBar;
