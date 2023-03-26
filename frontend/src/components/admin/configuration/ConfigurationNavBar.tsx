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
import { TbAt, TbMail, TbShare, TbSquare } from "react-icons/tb";

const categories = [
  { name: "常规设置", icon: <TbSquare /> },
  { name: "邮箱设置", icon: <TbMail /> },
  { name: "分享设置", icon: <TbShare /> },
  { name: "SMTP设置", icon: <TbAt /> },
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
          配置
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
                <Text size="sm">{category.name}</Text>
              </Group>
            </Box>
          ))}
        </Stack>
      </Navbar.Section>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Button mt="xl" variant="light" component={Link} href="/admin">
          返回
        </Button>
      </MediaQuery>
    </Navbar>
  );
};

export default ConfigurationNavBar;
