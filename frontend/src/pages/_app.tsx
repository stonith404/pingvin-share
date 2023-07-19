import {
  ColorScheme,
  ColorSchemeProvider,
  Container,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import type { AppProps } from "next/app";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { IntlProvider } from "react-intl";
import Header from "../components/header/Header";
import { ConfigContext } from "../hooks/config.hook";
import { UserContext } from "../hooks/user.hook";
import { LOCALES } from "../i18n/locales";
import authService from "../services/auth.service";
import configService from "../services/config.service";
import userService from "../services/user.service";
import GlobalStyle from "../styles/global.style";
import globalStyle from "../styles/mantine.style";
import Config from "../types/config.type";
import { CurrentUser } from "../types/user.type";
import {
  getLocaleByCode,
  isLanguageSupported,
  setLanguageCookie,
} from "../utils/i18n.util";
import userPreferences from "../utils/userPreferences.util";

const excludeDefaultLayoutRoutes = ["/admin/config/[category]"];

function App({ Component, pageProps }: AppProps) {
  const systemTheme = useColorScheme(pageProps.colorScheme);
  const router = useRouter();

  const [colorScheme, setColorScheme] = useState<ColorScheme>(systemTheme);

  const [user, setUser] = useState<CurrentUser | null>(pageProps.user);
  const [route, setRoute] = useState<string>(pageProps.route);

  const [configVariables, setConfigVariables] = useState<Config[]>(
    pageProps.configVariables
  );

  useEffect(() => {
    setRoute(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    setInterval(async () => await authService.refreshAccessToken(), 30 * 1000);
  }, []);

  useEffect(() => {
    const cookieLanguage = getCookie("language");
    if (pageProps.language != cookieLanguage) {
      setLanguageCookie(pageProps.language);
      if (cookieLanguage) location.reload();
    }
  }, []);

  useEffect(() => {
    const colorScheme =
      userPreferences.get("colorScheme") == "system"
        ? systemTheme
        : userPreferences.get("colorScheme");

    toggleColorScheme(colorScheme);
  }, [systemTheme]);

  const toggleColorScheme = (value: ColorScheme) => {
    setColorScheme(value ?? "light");
    setCookie("mantine-color-scheme", value ?? "light", {
      sameSite: "lax",
    });
  };

  const language = useRef(pageProps.language);

  return (
    <IntlProvider
      messages={getLocaleByCode(language.current)?.messages}
      locale={language.current}
      defaultLocale={LOCALES.ENGLISH.code}
    >
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
          <Notifications />
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
                {excludeDefaultLayoutRoutes.includes(route) ? (
                  <Component {...pageProps} />
                ) : (
                  <>
                    <Header />
                    <Container>
                      <Component {...pageProps} />
                    </Container>
                  </>
                )}
              </UserContext.Provider>
            </ConfigContext.Provider>
          </ModalsProvider>
        </ColorSchemeProvider>
      </MantineProvider>
    </IntlProvider>
  );
}

// Fetch user and config variables on server side when the first request is made
// These will get passed as a page prop to the App component and stored in the contexts
App.getInitialProps = async ({ ctx }: { ctx: GetServerSidePropsContext }) => {
  const { apiURL } = getConfig().serverRuntimeConfig;

  let pageProps: {
    user?: CurrentUser;
    configVariables?: Config[];
    route?: string;
    colorScheme: ColorScheme;
    language?: string;
  } = {
    route: ctx.resolvedUrl,
    colorScheme:
      (getCookie("mantine-color-scheme", ctx) as ColorScheme) ?? "light",
  };

  if (ctx.req) {
    const cookieHeader = ctx.req.headers.cookie;

    pageProps.user = await axios(`${apiURL}/api/users/me`, {
      headers: { cookie: cookieHeader },
    })
      .then((res) => res.data)
      .catch(() => null);

    pageProps.configVariables = (await axios(`${apiURL}/api/configs`)).data;

    pageProps.route = ctx.req.url;

    const requestLanguage =
      ctx.req.headers["accept-language"]?.substring(0, 2) ?? "en";

    pageProps.language =
      ctx.req.cookies["language"] ??
      (isLanguageSupported(requestLanguage) ? requestLanguage : "en");
  }
  return { pageProps };
};

export default App;
