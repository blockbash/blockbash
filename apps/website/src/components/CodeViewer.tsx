import {
  Tab, TabList, TabPanel, TabPanels, Tabs,
} from "@chakra-ui/react"
import React from "react"
import CodeBlock from "@theme/CodeBlock"

interface SmartContract {
  // TODO: move away from raw-loader to asset modules
  // Once finished, attempt to move away from "any" type
  // https://github.com/webpack-contrib/raw-loader?tab=readme-ov-file
  code: any;
  title: string
}

interface CodeViewerProps {
  smartContracts: SmartContract[]
}

export function CodeViewer({smartContracts}: CodeViewerProps) {
  return (
    <Tabs colorScheme="red" variant="enclosed-colored">
      <TabList>
        {smartContracts.map(smartContract =>
          <Tab>
            {smartContract.title}
          </Tab>
        )}
      </TabList>

      {/*TODO: Update to be inline with Styles.borderColor**/}
      <TabPanels border="1px"
                 borderColor="rgb(226, 232, 240)">
        {smartContracts.map(smartContract =>
          <TabPanel>
            <CodeBlock language="solidity">
              {smartContract.code}
            </CodeBlock>
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  )
}
