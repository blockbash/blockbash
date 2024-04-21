import { filePath, tutorialConfigConst } from "@blockbash/common-be"
import "@nomicfoundation/hardhat-chai-matchers"
import "@nomicfoundation/hardhat-ethers"
import "@typechain/hardhat"
// hardhat-deploy-ethers: Is an extension of @nomicfoundation/hardhat-ethers
// and both must be installed/imported
import {
  TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD
} from "hardhat/builtin-tasks/task-names"
import { type HardhatUserConfig, subtask } from "hardhat/config"
import "hardhat-deploy"
// https://github.com/wighawag/hardhat-deploy-ethers#installation
import "hardhat-deploy-ethers"
import "hardhat-ignore-warnings"
import "hardhat-tracer"
import path from "path"
import "tsconfig-paths/register"

subtask(
  TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD,
  async (args: {
    solcVersion: string
  }) => {
    if (args.solcVersion === "0.8.19") {
      const compilerPath = path.join(
        __dirname,
        "lib",
        "compilers",
        "solc-emscripten-wasm32-v0.8.19+commit.7dd6d404.js",
      )

      return {
        compilerPath,
        isSolcJs: true,
        longVersion: "solc-emscripten-wasm32-v0.8.19+commit.7dd6d404.js",
        version: args.solcVersion,
      }
    }
    throw new Error("lala")
  },
)
const config: HardhatUserConfig = {
  mocha: {
    allowUncaught: false,
    diff: true,
    fullTrace: true,
    inlineDiffs: true,
    reporter: "mochawesome",
    reporterOptions: {
      code: true,
      consoleReporter: "none",
      inline: false,
      quiet: true,
      reportDir: filePath.challengeResultsDirPath,
      reportFilename: filePath.challengeResultsFilePath,
      saveHtml: false,
      showPending: false,
    },
  },
  namedAccounts: tutorialConfigConst.DeployAccountGUID,
  networks: {
    hardhat: {live: false, saveDeployments: false},
  },
  solidity: {
    compilers: [
      {
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
        version: "0.8.19",
      },
    ],
  },
  tracer: {
    showAddresses: false,
  },
  typechain: {
    outDir: filePath.labCoreArtifactsTypechainDirPath,
    target: "ethers-v6",
  },
  warnings: "off",
  paths: {
    artifacts: filePath.labCoreArtifactsHardhatArtifactsDirPath,
    cache: filePath.labCoreArtifactsHardhatCacheDirPath,
  },
  // networks: {
  //   hardhat: {
  //     chainId: 1337,
  //   },
  // },
}

export default config
