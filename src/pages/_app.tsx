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
import authUtil, { IsSignedInContext } from "../utils/auth.util";
import { GlobalLoadingContext } from "../utils/loading.util";

function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const checkIfSignedIn = async () => {
    setIsLoading(true);
    setIsSignedIn(await authUtil.isSignedIn());
    setIsLoading(false);
  };
  useEffect(() => {
    checkIfSignedIn();
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
                <IsSignedInContext.Provider value={isSignedIn}>
                  <LoadingOverlay visible={isLoading} overlayOpacity={1} />
                  <Header />
                  <Container>
                    <Component {...pageProps} />
                  </Container>
                </IsSignedInContext.Provider>
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
