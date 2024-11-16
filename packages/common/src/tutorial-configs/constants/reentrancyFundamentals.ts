import { hardhatTracerGlobalTextReplacements } from "../constants.external";

export const reentrancyFundamentalsTextReplacements = [
  ...hardhatTracerGlobalTextReplacements,
  {
    matchRegex: "1000000000000000000",
    replaceWithText: "1 ETH",
  },
];
