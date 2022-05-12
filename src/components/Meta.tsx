import Head from "next/head";

const Meta = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <Head>
      {/* TODO: Doesn't work because script get only executed on client side */}
      <title>{title} - Pingvin Share</title>
      <meta name="og:title" content={`${title} - Pingvin Share`} />
      <meta
        name="og:description"
        content={
          description ?? "An open-source and self-hosted sharing platform."
        }
      />
      <meta name="twitter:title" content={`${title} - Pingvin Share`} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
};

export default Meta;
