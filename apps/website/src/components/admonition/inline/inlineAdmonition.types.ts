import { type ColorProps, type IconProps } from "@chakra-ui/react";
import { type IconType } from "react-icons";

export interface InlineAdmonitionWrapperProps {
  icon: IconType;
  iconBackgroundColor: NonNullable<IconProps["backgroundColor"]>;
  label: string;
  labelColor: NonNullable<ColorProps["color"]>;
}
