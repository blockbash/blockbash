// This eslint configuration applies to all projects

// Rules that are shared amongst all JSON configurations
const coreJsonRules = {
  "jsonc/array-bracket-newline": [
    "error",
    {
      minItems: null,
      multiline: true,
    },
  ],
  "jsonc/array-bracket-spacing": ["error", "never"],
  "jsonc/array-element-newline": ["error", "always"],
  "jsonc/indent": ["error", 2, {}],
  "jsonc/key-spacing": [
    "error",
    {
      afterColon: true,
      beforeColon: false,
      mode: "strict",
    },
  ],
  "jsonc/object-curly-newline": [
    "error",
    {
      consistent: true,
    },
  ],
  "jsonc/object-curly-spacing": ["error", "never"],
  "jsonc/object-property-newline": [
    "error",
    {
      allowAllPropertiesOnSameLine: false,
    },
  ],
  "jsonc/sort-array-values": [
    "error",
    {
      order: { type: "asc" },
      pathPattern: ".*",
    },
  ],
  "jsonc/sort-keys": [
    "error",
    {
      order: { type: "asc" },
      pathPattern: ".*",
    },
  ],
};

const jsoncFilePatterns = ["**/*.devcontainer*.json", "**/tsconfig.json"];
const packagejsonPattern = "**/package.json";

module.exports = {
  globals: {
    // https://github.com/eslint/eslint/issues/11553
    globalThis: false,
  },
  // eslint ignores dotfiles by default, so we un-ignore with !
  ignorePatterns: ["**/node_modules/**", "!.*"],
  overrides: [
    {
      extends: ["plugin:mdx/recommended"],
      files: ["**/*.{md,mdx}"],
      parser: "eslint-mdx",
      rules: {
        "mdx/remark": "error",
      },
      settings: {
        "mdx/code-blocks": true,
        "mdx/language-mapper": {},
      },
    },
    // Primarily leveraged for linting configuration files (e.g., ..eslintrc.js)
    {
      extends: [
        "eslint-config-standard",
        "plugin:perfectionist/recommended-natural",
        "plugin:prettier/recommended",
      ],
      files: ["**/*.js"],
    },
    {
      extends: ["plugin:yml/standard", "plugin:prettier/recommended"],
      files: ["**/*.{yml,yaml}"],
      parser: "yaml-eslint-parser",
      rules: {
        "yml/sort-keys": [
          "error",
          {
            allowLineSeparatedGroups: true,
            order: { type: "asc" },
            pathPattern: ".*",
          },
        ],
        "yml/sort-sequence-values": [
          "error",
          {
            order: { type: "asc" },
            pathPattern: ".*",
          },
        ],
      },
    },
    // Base configuration for all *.json files
    // We exclude jsonc files that leverage .json postfix
    // package.json has its own rules
    {
      excludedFiles: [...jsoncFilePatterns, packagejsonPattern],
      extends: ["plugin:jsonc/recommended-with-json"],
      files: ["**/*.json"],
      parser: "jsonc-eslint-parser",
      rules: coreJsonRules,
    },
    {
      excludedFiles: [packagejsonPattern],
      extends: ["plugin:jsonc/recommended-with-jsonc"],
      files: ["**/*.jsonc", ...jsoncFilePatterns],
      parser: "jsonc-eslint-parser",
      rules: coreJsonRules,
    },
    {
      extends: ["plugin:jsonc/recommended-with-json"],
      files: [packagejsonPattern],
      parser: "jsonc-eslint-parser",
      rules: {
        ...coreJsonRules,
        ...{
          // Inspired by
          // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/sort-keys.html#options
          "jsonc/sort-keys": [
            "error",
            {
              order: [
                "name",
                "version",
                "main",
                "private",
                "scripts",
                "scriptsComments",
                "dependencies",
                "dependenciesComments",
                "devDependencies",
                "devDependenciesComments",
                "volta",
                "voltaComments",
              ],
              pathPattern: "^$", // Hits the root properties
            },
            {
              order: { type: "asc" },
              pathPattern: ".*",
              // Hits all properties (except for root defined above)
            },
          ],
        },
      },
    },
  ],
  root: true,
};
