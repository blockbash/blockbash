import { tutorialConfigConst } from "@blockbash/common";
import { SVGModal } from "@components";
import LabPreview from "@site/static/img/lab-preview/lab-preview-full.svg";
import React from "react";

export function LabSample(): JSX.Element {
  return (
    <SVGModal
      SVG={LabPreview}
      SVGTitle={tutorialConfigConst.TutorialImageName.labSample}
      hasBorder={true}
    />
  );
}
