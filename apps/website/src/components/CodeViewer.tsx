// Expressive Code has an open feature for creating multiple editor tabs
// https://github.com/expressive-code/expressive-code/issues/22
// If multiple tabs are needed before this feature is launched, use this
// component for inspiration.


// import {
//   Tab, TabList, TabPanel, TabPanels, Tabs,
// } from "@chakra-ui/react"
// import React from "react"
// import CodeBlock from "@theme/CodeBlock"
//
// interface SmartContract {
//   code: any;
//   title: string
// }
//
// interface CodeViewerProps {
//   smartContracts: SmartContract[]
// }
//
// export function CodeViewer({smartContracts}: CodeViewerProps) {
//   return (
//     <Tabs colorScheme="red" variant="enclosed-colored">
//       <TabList>
//         {smartContracts.map(smartContract =>
//           <Tab>
//             {smartContract.title}
//           </Tab>
//         )}
//       </TabList>
//
//       {/*TODO: Update to be inline with Styles.borderColor**/}
//       <TabPanels border="1px"
//                  borderColor="rgb(226, 232, 240)">
//         {smartContracts.map(smartContract =>
//           <TabPanel>
//             <CodeBlock language="solidity">
//               {smartContract.code}
//             </CodeBlock>
//           </TabPanel>
//         )}
//       </TabPanels>
//     </Tabs>
//   )
// }
