import path from "path"
import type { Config } from "@docusaurus/types"
import type * as Preset from "@docusaurus/preset-classic"

// TODO: Add in missing properties within config
const config: Config = {
  baseUrl: "/",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  onDuplicateRoutes: "throw",
  organizationName: "blockbash",
  plugins: [
    async () =>
      ({
        configureWebpack() {
          return {
            context: __dirname,
            node: {
              __filename: true,
            },
            resolve: {
              // Keep in line with tsconfig.json, jsconfig.json
              // @site is already added by docusaurus
              // TODO: Integrate this with file.ts
              alias: {
                "@components": path.resolve(__dirname, "src/components"),
                "@features": path.resolve(__dirname, "src/features"),
                "@hooks": path.resolve(__dirname, "src/hooks"),
                "@src": path.resolve(__dirname, "src/"),
                "@utils": path.resolve(__dirname, "src/utils"),
                "@contracts": path.resolve(__dirname, "../lab-core/contracts"),
                "@partials": path.resolve(__dirname, "tutorials/partials"),
              },
            },
          }
        },
        name: "update-webpack-config",
      }),
    [
      "@docusaurus/plugin-ideal-image",
      ({
        // Use false to debug, but it incurs huge perf costs
        disableInDev: true,
        max: 1030,
        min: 640,
        quality: 70,
        steps: 2,
      }),
    ],
  ],

  presets: [
    [
      "classic",
      ({
        blog: false,
        docs: {
          editUrl:
            "https://github.com/blockbash/blockbash/tree/main/apps/website/",
          path: "tutorials",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      } satisfies Preset.Options),
    ],
  ],
  projectName: "BlockBash",
  tagline: "Where Developers Learn Blockchain Security",
  themeConfig:
    ({
      // image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        disableSwitch: true,
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} BlockBash, Inc.`,
        links: [
          {
            items: [
              {
                label: "Beginner Path",
                to: "/beginner-path/",
              },
            ],
            title: "Playlists",
          },
          {
            items: [
              {
                href: "https://github.com/blockbash/blockbash",
                label: "GitHub",
              },
            ],
            title: "More",
          },
        ],
        style: "dark",
      },
      prism: {
        additionalLanguages: ["solidity"]
      },
      navbar: {
        hideOnScroll: true,
        items: [
          {
            href: "https://github.com/blockbash/blockbash",
            label: "GitHub",
            position: "right",
          },
        ],
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/logo.svg',
        title: "BlockBash",
      },
    } satisfies Preset.ThemeConfig),
  title: "Blockbash",
  // favicon: 'img/favicon.ico',
  url: "https://blockbash.xyz",
  // webpack: {
  // TODO: swc-loader replaces babel to decrease build times.
  // https://github.com/rancher/rancher-docs/pull/667
  // docusaurus website:
  // https://github.com/facebook/docusaurus/blob/e17784effa2c370d81c7806c22ad19c6dce4a1cc/website/docusaurus.config.js#L140C15-L140C15
  // jsLoader: (isServer) => ({ loader: require.resolve("swc-loader"), options:
  // { jsc: { parser: { syntax: "typescript", tsx: true, }, target: "es2017",
  // transform: { react: { runtime: "automatic", }, }, }, module: { type:
  // isServer ? "commonjs" : "es6", }, }, }), },
}

module.exports = config
