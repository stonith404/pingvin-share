import { Global } from "@mantine/core";

const GlobalStyle = () => {
  return (
    <Global
      styles={() => ({
        a: {
          color: "inherit",
          textDecoration: "none",
        },
      })}
    />
  );
};
export default GlobalStyle;
