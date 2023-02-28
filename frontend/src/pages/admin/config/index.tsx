export function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: "/admin/config/branding",
    },
    props: {},
  };
}

const Config = () => {
  return null;
};

export default Config;
