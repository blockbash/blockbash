import type {Transformer} from 'unified';
import { visit } from "unist-util-visit"
import type {Code} from 'mdast';


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
    visit(ast, ['code'], (node ) => {
      // If within markdown code block
      if (node.type === 'code') {
        const codeNode = node as Code
        if (codeNode.lang === 'solidity'){
          // Allow the learner to easily copy/paste the solution code and
          // use it in their environment
          codeNode.value = codeNode.value.replace('contract AttackerSolution', 'contract Attacker')
        }
      }
    });
  }
}
