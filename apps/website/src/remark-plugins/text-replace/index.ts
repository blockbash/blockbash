import type { Code } from "mdast";
import type { Transformer } from "unified";

import { visit } from "unist-util-visit";
/*
Inspiration:
https://github.com/cert-manager/website/pull/1433/files
https://github.com/facebook/docusaurus/blob/29b7a4ddbbd057372d10370fc062075d79c98b46/packages/docusaurus-remark-plugin-npm2yarn/src/index.ts
*/

/*
 * Replace certain markdown strings
 * */
export function remarkTextReplacePlugin(): Transformer {
  return async (ast) => {
    const functionAnsiColor = "[32m";
    const defaultAnsiColor = "[97m";
    const verifySolutionText = "- Verifying solution...";
    visit(ast, ["code"], (node) => {
      // If within markdown code block
      if (node.type === "code") {
        const codeNode = node as Code;
        // Allow the learner to easily copy/paste the solution code and
        // use it in their environment
        codeNode.value = codeNode.value.replaceAll(
          "AttackerSolution",
          "Attacker",
        );
        if (codeNode.lang === "ansi") {
          // Remove weird characters within Terminal output
          codeNode.value = codeNode.value.replaceAll(
            "ï¿½ï¿½ï¿½",
            defaultAnsiColor,
          );
          // Make receive() function colors match other function colors
          codeNode.value = codeNode.value.replaceAll("[39m", functionAnsiColor);
          // Make value parameters match the default text color
          codeNode.value = codeNode.value.replaceAll("[90m", defaultAnsiColor);

          codeNode.value = codeNode.value.replaceAll(
            verifySolutionText,
            `${defaultAnsiColor}${verifySolutionText}`,
          );
        }
      }
    });
  };
}
