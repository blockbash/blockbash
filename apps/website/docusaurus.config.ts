// Can't use path aliases as they haven't been loaded
// noinspection ES6PreferShortImport

import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";

import path from "path";
import rehypeExpressiveCode, {
  type RehypeExpressiveCodeOptions,
} from "rehype-expressive-code";
import remarkCodeSnippets from "remark-code-snippets";

import {remarkTextReplacePlugin} from "./src/remark-plugins/text-replace";

// rehypeExpressiveCodeOptions: For whatever reason, I can't use one of the
// default (bundled) themes.  If you ever need to use another theme, you must
// manually install it.
const rehypeExpressiveCodeOptions: RehypeExpressiveCodeOptions = {
  frames: {
    // showCopyToClipboardButton: As of 5/2024 this doesn't work
    showCopyToClipboardButton: false,
  },
};

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
    async () => ({
      configureWebpack() {
        return {
          context: __dirname,
          node: {
            __filename: true,
          },
          resolve: {
            // Keep in line with tsconfig.json, jsconfig.json
            // @site is already added by docusaurus
            // TODO: Integrate all file paths (in this file) with file.ts
            alias: {
              "@components": path.resolve(__dirname, "src/components"),
              "@contracts": path.resolve(__dirname, "../lab-core/contracts"),
              "@features": path.resolve(__dirname, "src/features"),
              "@hooks": path.resolve(__dirname, "src/hooks"),
              "@partials": path.resolve(__dirname, "tutorials/partials"),
              "@src": path.resolve(__dirname, "src/"),
              "@utils": path.resolve(__dirname, "src/utils"),
            },
          },
        };
      },
      name: "update-webpack-config",
    }),
    [
      "@docusaurus/plugin-ideal-image",
      {
        // Use false to debug, but it incurs huge perf costs
        disableInDev: true,
        max: 1030,
        min: 640,
        quality: 70,
        steps: 2,
      },
    ],
  ],

  presets: [
    [
      "classic",
      {
        blog: false,
        docs: {
          beforeDefaultRehypePlugins: [
            /*
            * Provides shiki syntax highlighting and robust code annotations
            * This is more robust than the default prism integration */
            [rehypeExpressiveCode, rehypeExpressiveCodeOptions],
          ],
          beforeDefaultRemarkPlugins: [
            [
              /* Allows for full code import into markdown code blocks.
              * You can also import certain lines of code from a larger
              * file */
              remarkCodeSnippets,
              {
                baseDir: path.resolve(__dirname, "../lab-core/contracts"),
              },
            ],
            [
              remarkTextReplacePlugin,
              {
              },
            ],
          ],
          editUrl:
            "https://github.com/blockbash/blockbash/tree/main/apps/website/",
          path: "tutorials",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      } satisfies Preset.Options,
    ],
  ],
  projectName: "BlockBash",
  tagline: "Where Developers Learn Blockchain Security",
  themeConfig: {
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
  } satisfies Preset.ThemeConfig,
  title: "Blockbash",
  // favicon: 'img/favicon.ico',
  url: "https://blockbash.xyz",
};

module.exports = config;
