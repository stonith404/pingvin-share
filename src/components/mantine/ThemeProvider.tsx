import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { setCookies } from "cookies-next";
import { Dispatch, ReactNode, SetStateAction } from "react";
import mantineTheme from "../../styles/mantine.style";

const ThemeProvider = ({
  children,
  colorScheme,
  setColorScheme,
}: {
  children: ReactNode;
  colorScheme: ColorScheme;
  setColorScheme: Dispatch<SetStateAction<ColorScheme>>;
}) => {
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookies("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <MantineProvider theme={{ colorScheme, ...mantineTheme }} withGlobalStyles>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <ModalsProvider>{children}</ModalsProvider>
      </ColorSchemeProvider>
    </MantineProvider>
  );
};

export default ThemeProvider;
