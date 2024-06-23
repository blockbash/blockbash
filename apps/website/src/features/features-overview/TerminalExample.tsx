import { tutorialConfigConst } from "@blockbash/common";
import { SVGModal } from "@components";
import LabPreview from "@site/static/img/lab-preview/lab-preview-terminal.svg";
import React from "react";

export function TerminalExample(): JSX.Element {
  return (
    <SVGModal
      SVG={LabPreview}
      SVGTitle={tutorialConfigConst.TutorialImageName.labTerminalExample}
      hasBorder={true}
    />
  );
}
