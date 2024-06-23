import { tutorialConfigConst } from "@blockbash/common";
import { SVGModal } from "@components";
import LabPreview from "@site/static/img/lab-preview/lab-preview-editor.svg";
import React from "react";

export function EditorExample(): JSX.Element {
  return (
    <SVGModal
      SVG={LabPreview}
      SVGTitle={tutorialConfigConst.TutorialImageName.labEditorExample}
      hasBorder={true}
    />
  );
}
