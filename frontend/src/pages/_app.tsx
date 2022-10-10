import {
  ColorScheme,
  Container,
  LoadingOverlay,
  MantineProvider,
  Stack,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { getCookie, setCookies } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/navBar/NavBar";
import { UserContext } from "../hooks/user.hook";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import GlobalStyle from "../styles/global.style";
import globalStyle from "../styles/mantine.style";
import { CurrentUser } from "../types/user.type";
import { GlobalLoadingContext } from "../utils/loading.util";

function App(
  props: AppProps & { colorScheme: ColorScheme; environmentVariables: any }
) {
  const { Component, pageProps } = props;

  const systemTheme = useColorScheme();

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);

  const getInitalData = async () => {
    setIsLoading(true);
    setUser(await userService.getCurrentUser());
    setIsLoading(false);
  };

  useEffect(() => {
    setInterval(async () => await authService.refreshAccessToken(), 30 * 1000);
    getInitalData();
  }, []);

  useEffect(() => {
    setCookies("mantine-color-scheme", systemTheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
    setColorScheme(systemTheme);
  }, [systemTheme]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme, ...globalStyle }}
    >
      <GlobalStyle />
      <NotificationsProvider>
        <ModalsProvider>
          <GlobalLoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {isLoading ? (
              <LoadingOverlay visible overlayOpacity={1} />
            ) : (
              <UserContext.Provider value={user}>
                <LoadingOverlay visible={isLoading} overlayOpacity={1} />
                <Stack justify="space-between" sx={{ minHeight: "100vh" }}>
                  <div>
                    <Header />
                    <Container>
                      <Component {...pageProps} />
                    </Container>
                  </div>
                  <Footer />
                </Stack>
              </UserContext.Provider>
            )}
          </GlobalLoadingContext.Provider>
        </ModalsProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => {
  return {
    colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
  };
};
