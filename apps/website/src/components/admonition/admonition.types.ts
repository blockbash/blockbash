import type React from "react";

export interface AdmonitionProps {
  children: React.ReactElement;
  isCentered?: boolean;
  isFlattened?: boolean;
  labelOverride?: string;
}
