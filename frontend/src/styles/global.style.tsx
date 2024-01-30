import { Global } from "@mantine/core";

const GlobalStyle = () => {
  return (
    <Global
      styles={() => ({
        a: {
          color: "inherit",
          textDecoration: "none",
        },
        "table.md, table.md th:nth-of-type(odd), table.md td:nth-of-type(odd)": {
          background: "rgba(50, 50, 50, 0.5)",
        },
        "table.md td": {
          paddingLeft: "0.5em",
          paddingRight: "0.5em",
        },
      })}
    />
  );
};
export default GlobalStyle;
