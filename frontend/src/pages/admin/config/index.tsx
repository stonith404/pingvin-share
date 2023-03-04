export function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: "/admin/config/general",
    },
    props: {},
  };
}

const Config = () => {
  return null;
};

export default Config;
