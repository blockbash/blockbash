import { Modal } from "@components";
import React, { type ComponentType, type SVGProps } from "react";

import { type ModalProps } from "./Modal";

/* SVG Type:
Docusaurus inlines imported SVGs: https://docusaurus.io/docs/markdown-features/assets#inline-svgs 
The corresponding type is:
https://github.com/facebook/docusaurus/blob/32d5ab08caab5e525ee5553807409768dfff711d/packages/docusaurus-module-type-aliases/src/index.d.ts#L375C25-L377C4
*/
interface SVGModalProps {
  SVG: ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;
  SVGTitle: ModalProps["title"];
  hasBorder?: ModalProps["hasBorder"];
  maxW?: ModalProps["maxW"];
}

export function SVGModal({
  SVG,
  SVGTitle,
  hasBorder = false,
  maxW,
}: SVGModalProps): JSX.Element {
  return (
    <>
      <Modal hasBorder={hasBorder} maxW={maxW} title={SVGTitle}>
        <SVG height={"auto"} />
      </Modal>
    </>
  );
}
