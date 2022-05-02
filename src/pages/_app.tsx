import {
  ColorScheme,
  Container,
  LoadingOverlay,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import "../../styles/globals.css";
import ThemeProvider from "../components/mantine/ThemeProvider";
import Header from "../components/navBar/NavBar";
import globalStyle from "../styles/global.style";
import aw from "../utils/appwrite.util";
import authUtil, { IsSignedInContext } from "../utils/auth.util";
import configUtil, { ConfigContext } from "../utils/config.util";
import { GlobalLoadingContext } from "../utils/loading.util";

function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [environmentVariables, setEnvironmentVariables] = useState<any>({});

  const getInitalData = async () => {
    setIsLoading(true);
    const environmentVariables = await configUtil.getGonfig();
    aw.setEndpoint(environmentVariables.APPWRITE_HOST);
    setEnvironmentVariables(environmentVariables);
    setIsSignedIn(await authUtil.isSignedIn());
    setIsLoading(false);
  };
  useEffect(() => {
    getInitalData();
  }, []);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={globalStyle}>
      <ThemeProvider colorScheme={colorScheme} setColorScheme={setColorScheme}>
        <NotificationsProvider>
          <ModalsProvider>
            <GlobalLoadingContext.Provider value={{ isLoading, setIsLoading }}>
              {isLoading ? (
                <LoadingOverlay visible overlayOpacity={1} />
              ) : (
                <ConfigContext.Provider value={environmentVariables}>
                  <IsSignedInContext.Provider value={isSignedIn}>
                    <LoadingOverlay visible={isLoading} overlayOpacity={1} />
                    <Header />
                    <Container>
                      <Component {...pageProps} />
                    </Container>
                  </IsSignedInContext.Provider>
                </ConfigContext.Provider>
              )}
            </GlobalLoadingContext.Provider>
          </ModalsProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </MantineProvider>
  );
}

export default App;

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});
