import { Switch, useMantineColorScheme } from "@mantine/core";

const ToggleThemeButton = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Switch
      size="sm"
      checked={colorScheme == "dark"}
      onClick={(v) =>
        toggleColorScheme(v.currentTarget.checked ? "dark" : "light")
      }
      onLabel="ON"
      offLabel="OFF"
    />
  );
};

export default ToggleThemeButton;
