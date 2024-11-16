// Settings that should be applied to all typescript files
// TODO: Ensure that all rule bundles support (and rule packages) support eslint 9.  When so, update to support eslint flat config and then bump all eslint related package versions.
const typescriptBaseExtends = [
  "eslint-config-love",
  "plugin:perfectionist/recommended-natural",
  "plugin:prettier/recommended",
];

const overridesBaseExtends = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
};
module.exports = {
  overrides: [
    {
      excludedFiles: ["*.spec.ts"],
      ...overridesBaseExtends,
      extends: [
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        ...typescriptBaseExtends,
      ],
      // Leveraged so eslint can find imported modules correctly
      files: ["*.{ts,tsx}"], // Your TypeScript files extension
      rules: {
        "@typescript-eslint/explicit-function-return-type": 0,
        /*
         * no-unescaped-entities: This rule will fire whenever an apostrophe is within a sentence. Yes, I could use the entity "&apos;" but that would decrease readability.  The cons outweigh the pros.
         * */
        "react/no-unescaped-entities": "off",
        /*
         Right now, this rule mandates that we pass all injectedDependencies to useEffect, however this can cause unneeded renders because we leverage logger  (and other non-reactive injectedDependencies) within useEffect functions. Once useEffectEvent is released, we should be able to update our code and remove this exception
        */
        "react-hooks/exhaustive-deps": 0,
      },
    },
    // Needs to come after general .ts rules in order
    // to override the settings appropriately
    {
      extends: ["plugin:mocha/recommended", ...typescriptBaseExtends],
      files: ["*.spec.ts"],
      ...overridesBaseExtends,
      plugins: ["chai-friendly"],
      rules: {
        "@typescript-eslint/no-unused-expressions": 0,
        "chai-friendly/no-unused-expressions": 2,
        "prefer-arrow-callback": 0,
      },
    },
  ],
};
