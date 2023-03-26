import Head from "next/head";
import useConfig from "../hooks/config.hook";

const Meta = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  const config = useConfig();

  const metaTitle = `${title} - ${config.get("general.appName")}`;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="og:title" content={metaTitle} />
      <meta
        name="og:description"
        content={
          description ?? "一个开源和自托管的共享平台."
        }
      />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
};

export default Meta;
