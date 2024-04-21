// Tests that apply to all labs

// Disable mocha/no-setup-in-describe for dynamically generated tests
// https://github.com/lo1tuma/eslint-plugin-mocha/blob/8eb0cc2406ba9df25e3b9306d2cc9adcf281808b/docs/rules/no-setup-in-describe.md#disallow-setup-in-describe-blocks-mochano-setup-in-describe
/* eslint-disable mocha/no-setup-in-describe */

import {
  createBlockchainDeploy,
  tutorialConfig,
  type tutorialConfigTypes,
} from "@blockbash/common-be"
import { expect } from "chai"
import hre from "hardhat"
import "mocha"

import { challengeEnv, challengeEnvCost } from "../lib/challenge"

challengeEnv.getAutomationEnvDescribe({
  challengeGroupName: challengeEnvCost.ChallengeEnv.automationEnvGlobalGroup,
  fn() {
    describe("Deployments for", function () {
      const blockchainDeploy = createBlockchainDeploy({ hre })
      beforeEach(async function () {
        await blockchainDeploy.deployAllContracts()
      })
      const contractsByTutorial = tutorialConfig.getContractsByTutorial()
      for (const tutorialGUID of Object.keys(
        contractsByTutorial,
      ) as tutorialConfigTypes.TutorialGUIDs) {
        context(`${tutorialGUID}`, function () {
          for (const contract of contractsByTutorial[tutorialGUID]) {
            it(`should create the ${contract.name} contract`, async function () {
              const deployedContract =
                await blockchainDeploy.getDeployedContract({
                  contractName: contract.name,
                })
              expect(await deployedContract.getAddress()).to.exist
            })
            it(`should create the correct starting balance for the ${contract.name} contract`, async function () {
              expect(
                await blockchainDeploy.getWeiBalance({
                  contractName: contract.name,
                }),
              ).to.eq(contract.weiAmount)
            })
          }
        })
      }
    })
  },
  testSummary: "Deployments for a tutorial should create the correct contracts",
})
