const Logo = ({ height, width }: { height: number; width: number }) => {
  const webroot = process.env.WEBROOT || "";
  return <img src={webroot + "/img/logo.png"} alt="logo" height={height} width={width} />;
};
export default Logo;
