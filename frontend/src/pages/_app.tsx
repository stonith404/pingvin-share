import {
  ColorScheme,
  ColorSchemeProvider,
  Container,
  LoadingOverlay,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../components/navBar/NavBar";
import { ConfigContext } from "../hooks/config.hook";
import usePreferences from "../hooks/usePreferences";
import { UserContext } from "../hooks/user.hook";
import authService from "../services/auth.service";
import configService from "../services/config.service";
import userService from "../services/user.service";
import GlobalStyle from "../styles/global.style";
import globalStyle from "../styles/mantine.style";
import Config from "../types/config.type";
import { CurrentUser } from "../types/user.type";
import { GlobalLoadingContext } from "../utils/loading.util";

function App({ Component, pageProps }: AppProps) {
  const systemTheme = useColorScheme();
  const router = useRouter();
  const preferences = usePreferences();

  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [configVariables, setConfigVariables] = useState<Config[] | null>(null);

  const getInitalData = async () => {
    setIsLoading(true);
    setConfigVariables(await configService.list());
    await authService.refreshAccessToken();
    setUser(await userService.getCurrentUser());
    setIsLoading(false);
  };

  useEffect(() => {
    setInterval(async () => await authService.refreshAccessToken(), 30 * 1000);
    getInitalData();
  }, []);

  useEffect(() => {
    if (
      configVariables &&
      configVariables.filter((variable) => variable.key)[0].value == "false" &&
      !["/auth/signUp", "/admin/setup"].includes(router.asPath)
    ) {
      router.push(!user ? "/auth/signUp" : "/admin/setup");
    }
  }, [router.asPath]);

  useEffect(() => {
    setColorScheme(
      preferences.get("colorScheme") == "system"
        ? systemTheme
        : preferences.get("colorScheme")
    );
  }, [systemTheme]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme, ...globalStyle }}
    >
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={(value) => setColorScheme(value ?? "light")}
      >
        <GlobalStyle />
        <NotificationsProvider>
          <ModalsProvider>
            <GlobalLoadingContext.Provider value={{ isLoading, setIsLoading }}>
              {isLoading ? (
                <LoadingOverlay visible overlayOpacity={1} />
              ) : (
                <ConfigContext.Provider value={configVariables}>
                  <UserContext.Provider value={{ user, setUser }}>
                    <LoadingOverlay visible={isLoading} overlayOpacity={1} />
                    <Header />
                    <Container>
                      <Component {...pageProps} />
                    </Container>
                  </UserContext.Provider>{" "}
                </ConfigContext.Provider>
              )}
            </GlobalLoadingContext.Provider>
          </ModalsProvider>
        </NotificationsProvider>
      </ColorSchemeProvider>
    </MantineProvider>
  );
}

export default App;
