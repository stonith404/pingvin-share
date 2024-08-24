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
  // By default, Docusaurus generates a sidebar from the docs folder structure
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
          id: "How to/translate",
        },
        {
          type: "doc",
          id: "How to/contribute",
        },
      ],
    },
    {
      type: "link",
      label: "Learn more",
      href: "https://discord.gg/HutpbfB59Q",
    },
  ],
};

// But you can create a sidebar manually
/*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */

export default sidebars;
