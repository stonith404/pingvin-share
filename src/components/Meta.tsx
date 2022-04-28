import Head from "next/head";

const Meta = ({ title }: { title: string }) => {
  return (
    <Head>
      <title>{title} - Pingvin Share</title>
    </Head>
  );
};

export default Meta;
