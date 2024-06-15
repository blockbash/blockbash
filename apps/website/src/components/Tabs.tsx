import {
  Tab as ChakraTab,
  Tabs as ChakraTabs,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { Styles } from "@src/css";
import React, { type ReactNode } from "react";

import { SectionWrapper } from "./layout/SectionWrapper";

interface Tab {
  content: ReactNode;
  title: string;
}

interface TabsProps {
  tabs: Tab[];
}

export function Tabs(props: TabsProps): JSX.Element {
  return (
    <ChakraTabs colorScheme="red" variant={"soft-rounded"}>
      <TabList>
        {props.tabs.map((tab) => (
          <ChakraTab
            borderColor={Styles.borderColorMin}
            borderStyle={"solid"}
            key={tab.title}
            rounded={"2xl"}
          >
            {tab.title}
          </ChakraTab>
        ))}
      </TabList>

      <TabPanels
        backgroundColor={Styles.whiteBackgroundEmphasisColor}
        boxShadow={Styles.boxShadowMin}
        mt={0.5}
        rounded={"2xl"}
      >
        {props.tabs.map((tab) => (
          <TabPanel key={tab.title}>
            <SectionWrapper marginTop={0} spacing={2}>
              {tab.content}
            </SectionWrapper>
          </TabPanel>
        ))}
      </TabPanels>
    </ChakraTabs>
  );
}
