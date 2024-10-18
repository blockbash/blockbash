import { filePath, tutorialConfigConst } from "@blockbash/common-be";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
// hardhat-deploy-ethers: Is an extension of @nomicfoundation/hardhat-ethers
import "@nomicfoundation/hardhat-ethers";
// and both must be installed/imported
import { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } from "hardhat/builtin-tasks/task-names";
import { type HardhatUserConfig, subtask } from "hardhat/config";
import "hardhat-deploy";
// https://github.com/wighawag/hardhat-deploy-ethers#installation
import "hardhat-deploy-ethers";
import "hardhat-ignore-warnings";
import "hardhat-tracer";
import path from "path";
import "tsconfig-paths/register";
/*
 * Updating solc:
 * + Find a version of solc that is supported: https://hardhat.org/hardhat-runner/docs/reference/solidity-support
 * + Grab the correct compiler version identifier: https://github.com/ethereum/solc-bin/blob/gh-pages/emscripten-wasm32/list.txt (i.e., COMPILER_IDENTIFIER)
 * + Do a global search/replace for PREVIOUS_COMPILER_IDENTIFIER and replace with NEW_COMPILER_IDENTIFIER
 * + OPTIONAL: Update "JuanBlanco.solidity" plugin version.
 * */
subtask(
  TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD,
  async (args: { solcVersion: string }) => {
    // solcVersion: Needs to be synced with global.env solc_version
    if (args.solcVersion === "0.8.24") {
      /*
       * compilerPath should be inspired by the following filesystem.env values:
       * container_lab_core_compilers_solcjs_symlink_file_path
       * lab_core_compilers_solcjs_symlink_file_path
       *  */
      const compilerPath = path.join(
        __dirname,
        "artifacts",
        "compilers",
        "solcjs",
      );

      return {
        compilerPath,
        isSolcJs: true,
        longVersion: args.solcVersion,
        version: args.solcVersion,
      };
    }
  },
);
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
    hardhat: { live: false, saveDeployments: false },
  },
  paths: {
    artifacts: filePath.labCoreArtifactsHardhatArtifactsDirPath,
    cache: filePath.labCoreArtifactsHardhatCacheDirPath,
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
        version: "0.8.24",
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
  // networks: {
  //   hardhat: {
  //     chainId: 1337,
  //   },
  // },
};

export default config;
