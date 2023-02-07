import Head from "next/head";

const Meta = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  const metaTitle = `${title} - Pingvin Share`;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="og:title" content={metaTitle} />
      <meta
        name="og:description"
        content={
          description ?? "An open-source and self-hosted sharing platform."
        }
      />
      <meta property="og:image" content="/img/opengraph-default.png" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
};

export default Meta;
