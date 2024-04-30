import {
  Tab, TabList, TabPanel, TabPanels, Tabs as _Tabs,
} from "@chakra-ui/react"
import React, { ReactNode } from "react"

interface Tab {
  title: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
}

export function Tabs(props: TabsProps) {
  return (
    <_Tabs colorScheme="red" variant="enclosed-colored">
      <TabList>
        {props.tabs.map(tab =>
          <Tab>
            {tab.title}
          </Tab>
        )}
      </TabList>

      {/*TODO: Update to be inline with Styles.borderColor**/}
      <TabPanels border="1px"
                 borderColor="rgb(226, 232, 240)">
        {props.tabs.map(tab =>
          <TabPanel>
            {tab.content}
          </TabPanel>
        )}
      </TabPanels>
    </_Tabs>
  )
}
