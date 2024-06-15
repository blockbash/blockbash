import { type ListProps as ChakraListProps } from "@chakra-ui/react";
import { Styles } from "@src/css";
import { type ReactNode } from "react";

export interface ListProps extends ChakraListProps {
  children: ReactNode;
}
export const baseListProps: ChakraListProps = {
  marginBottom: 0,
  marginLeft: 0,
  paddingLeft: Styles.listLeftPadding,
};
