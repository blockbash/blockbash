import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";

// noinspection ES6PreferShortImport
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import path from "path";
import rehypeExpressiveCode, {
  type RehypeExpressiveCodeOptions,
} from "rehype-expressive-code";
import remarkCodeSnippets from "remark-code-snippets";
import { getTheme } from "shiki-themes";

// Can't use path aliases (within imports) as they haven't been loaded
import { expressiveCode, expressiveCodeThemes } from "./docusaurus.const";
// noinspection ES6PreferShortImport
import { remarkTextReplacePlugin } from "./src/remark-plugins/text-replace";
// Can't use path aliases as they haven't been loaded
// rehypeExpressiveCodeOptions: For whatever reason, I can't use one of the
// default (bundled) themes.  If you ever need to use another theme, you must
// manually install it.

const rehypeExpressiveCodeOptions: RehypeExpressiveCodeOptions = {
  frames: {
    // showCopyToClipboardButton: As of 5/2024 this doesn't work
    showCopyToClipboardButton: false,
  },
  plugins: [
    // Must define expressive code related css here
    pluginCollapsibleSections(),
    {
      baseStyles: `
      .ec-line.ins, .ec-line.del, .ec-line.mark {
        margin-top: 2px;
        margin-bottom: 2px;
        }
      .frame {
        /* Allows for correct scrolling behavior */
        max-width: 100%;
        overflow: auto;
      }
      .frame pre {
        /* Allows for correct scrolling behavior */
        max-height: var(--chakra-sizes-3xl);
        overflow: auto;
      }
      `,
      name: "expressive-code-custom-css",
    },
  ],
  styleOverrides: {
    collapsibleSections: {
      // Styles the "X collapsed lines" indicator
      closedBackgroundColor: ({ theme }) =>
        theme.name === expressiveCodeThemes.githubLight
          ? "var(--chakra-colors-gray-200)"
          : "rgb(84 174 255 / 20%)",
    },
    frames: {
      editorActiveTabBackground: "var(--chakra-colors-gray-200)",
      editorActiveTabIndicatorBottomColor: "unset",
      editorActiveTabIndicatorTopColor: "unset",
      // editorBackground: Styles.whiteBackgroundEmphasisColorCssVar,
      editorBackground: "var(--chakra-colors-gray-50)",
      // editorTabBarBackground: if not "white", top frame border will be
      // removed
      editorTabBarBackground: "white",
      editorTabBarBorderColor: "unset",
      frameBoxShadowCssValue: "unset",
      terminalTitlebarDotsOpacity: ".5",
    },
  },
  themeCssSelector: (theme) =>
    `.${expressiveCode.themeSelectorPrefix}${theme.name}`,
  themes: [
    getTheme(expressiveCodeThemes.materialThemeDarker),
    getTheme(expressiveCodeThemes.githubLight),
  ],
  useThemedScrollbars: false,
};
// TODO: Add in missing properties within config
const config = {
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
            [remarkTextReplacePlugin, {}],
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
    docs: {
      sidebar: {
        hideable: true,
      },
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
} satisfies Config;
module.exports = config;
