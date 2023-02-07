import {
  ColorScheme,
  ColorSchemeProvider,
  Container,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import type { AppProps } from "next/app";
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

function App({ Component, pageProps }: AppProps) {
  const systemTheme = useColorScheme(pageProps.colorScheme);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(systemTheme);
  const preferences = usePreferences();

  const [user, setUser] = useState<CurrentUser | null>(pageProps.user);

  const [configVariables, setConfigVariables] = useState<Config[]>(
    pageProps.configVariables
  );

  useEffect(() => {
    setInterval(async () => await authService.refreshAccessToken(), 30 * 1000);
  }, []);

  useEffect(() => {
    const colorScheme =
      preferences.get("colorScheme") == "system"
        ? systemTheme
        : preferences.get("colorScheme");

    toggleColorScheme(colorScheme);
  }, [systemTheme]);

  const toggleColorScheme = (value: ColorScheme) => {
    setColorScheme(value ?? "light");
    setCookie("mantine-color-scheme", value ?? "light", {
      sameSite: "lax",
    });
  };

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme, ...globalStyle }}
    >
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <GlobalStyle />
        <NotificationsProvider>
          <ModalsProvider>
            <ConfigContext.Provider
              value={{
                configVariables,
                refresh: async () => {
                  setConfigVariables(await configService.list());
                },
              }}
            >
              <UserContext.Provider
                value={{
                  user,
                  refreshUser: async () => {
                    const user = await userService.getCurrentUser();
                    setUser(user);
                    return user;
                  },
                }}
              >
                <Header />
                <Container>
                  <Component {...pageProps} />
                </Container>
              </UserContext.Provider>
            </ConfigContext.Provider>
          </ModalsProvider>
        </NotificationsProvider>
      </ColorSchemeProvider>
    </MantineProvider>
  );
}

// Fetch user and config variables on server side when the first request is made
// These will get passed as a page prop to the App component and stored in the contexts
App.getInitialProps = async ({ ctx }: { ctx: GetServerSidePropsContext }) => {
  let pageProps: {
    user?: CurrentUser;
    configVariables?: Config[];
    colorScheme: ColorScheme;
  } = {
    colorScheme:
      (getCookie("mantine-color-scheme", ctx) as ColorScheme) ?? "light",
  };

  if (ctx.req) {
    const cookieHeader = ctx.req.headers.cookie;

    pageProps.user = await axios(`http://localhost:8080/api/users/me`, {
      headers: { cookie: cookieHeader },
    })
      .then((res) => res.data)
      .catch(() => null);

    pageProps.configVariables = (
      await axios(`http://localhost:8080/api/configs`)
    ).data;
  }

  return { pageProps };
};

export default App;
