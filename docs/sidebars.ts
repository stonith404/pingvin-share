import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: "doc",
      id : "introduction",
    },
    {
      type: "category",
      label: "Getting Started",
      items: [
        {
          type: "doc",
          id: "setup/installation",
        },
        {
          type: "doc",
          id: "setup/configuration",
        },
        {
          type: "doc",
          id: "setup/integrations",
        },
        {
          type: "doc",
          id: "setup/oauth2login",
        },
        {
          type: "doc",
          id: "setup/upgrading",
        },
      ],
    },
    {
      type: "category",
      label: "Helping Out",
      items: [
        {
          type: "doc",
          id: "help-out/translate",
        },
        {
          type: "doc",
          id: "help-out/contribute",
        },
      ],
    },
    {
      type: "link",
      label: "Discord",
      href: "https://discord.gg/HutpbfB59Q",
    },
  ],
};

export default sidebars;
