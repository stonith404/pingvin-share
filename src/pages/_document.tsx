import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#46509e" />
          <link rel="apple-touch-icon" href="/icons/icon-white-128x128.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        {/* Plausible analytics */}
        <script
          defer
          data-domain="pingvin-share.dev.eliasschneider.com"
          src="https://analytics.eliasschneider.com/js/plausible.js"
        ></script>
      </Html>
    );
  }
}
