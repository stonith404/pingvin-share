import Image from "next/image";

const Logo = ({ height, width }: { height: number; width: number }) => {
  return (
    <Image src="/api/configs/logo" alt="logo" height={height} width={width} />
  );
};
export default Logo;
