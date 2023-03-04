import Image from "next/image";

const Logo = ({ height, width }: { height: number; width: number }) => {
  return (
    <Image src="/img/logo.png" alt="logo" height={height} width={width} />
  );
};
export default Logo;
