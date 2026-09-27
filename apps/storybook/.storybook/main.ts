import type { StorybookConfig } from "storybook-react-rsbuild";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  staticDirs: ["../public"], //👈 Configures the static asset folder in Storybook
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-mcp",
    "./manifest-preset.ts",
  ],
  features: {
    backgrounds: false, // 👈 disable the backgrounds feature
    // Generates /manifests/components.json and /manifests/docs.json for the MCP docs toolset.
    componentsManifest: true,
  },
  typescript: {
    // Richer prop types for the MCP docs toolset than the default react-docgen parser.
    reactDocgen: "react-docgen-typescript",
  },
  framework: {
    name: "storybook-react-rsbuild",
    options: {},
  },
};
export default config;
