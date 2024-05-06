import {
  Tabs as _Tabs,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { Styles } from "@src/css";
import React, { type ReactNode } from "react";

interface Tab {
  content: ReactNode;
  title: string;
}

interface TabsProps {
  tabs: Tab[];
}

export function Tabs(props: TabsProps) {
  return (
    <_Tabs colorScheme="red" variant={"soft-rounded"}>
      <TabList>
        {props.tabs.map((tab) => (
          <Tab
            backgroundColor={"unset"}
            borderLeftStyle={"none"}
            borderRightStyle={"none"}
            borderStyle={"none"}
          >
            {tab.title}
          </Tab>
        ))}
      </TabList>

      {/* TODO: Update to be inline with Styles.borderColor**/}
      <TabPanels
        mt={.5}
        backgroundColor={"gray.50"}
        boxShadow={Styles.boxShadowMed}
        rounded={"2xl"}
      >
        {props.tabs.map((tab) => (
          <TabPanel>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </_Tabs>
  );
}
