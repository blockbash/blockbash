import {
  Env,
  Eth,
  TutorialsConfigOrchestrator,
  envConst,
  envTypes,
  type ethTypes,
  schema,
  tutorialConfigConst,
  tutorialConfigTypes,
  tutorialsConfig,
} from "@blockbash/common";
import { BigNumber } from "@ethersproject/bignumber";
import appRootPath from "app-root-path";
import chalk from "chalk";
import * as console from "console";
import { ethers } from "ethers";
import * as fs from "fs";
import type { HardhatRuntimeEnvironment } from "hardhat/types"
import jp from "jsonpath";
import lowdash from "lodash";
import ora from "ora";
import * as path from "path";
import * as process from "process";
import shell from "shelljs";
import winston from "winston";

import { BlockchainDeploy } from "./blockchain";
import * as blockchainTypes from "./blockchain.types";
import { ChallengeParser } from "./challengeParser";
import * as challengeParserTypes from "./challengeParser.types";
import { File, FilePath } from "./file";
import * as fileTypes from "./file.types";
import { Logger } from "./logger";
import * as loggerTypes from "./logger.types";
import { Shell } from "./shell";
import * as shellTypes from "./shell.types";
import { Spinner } from "./spinner";
import * as spinnerTypes from "./spinner.types";

// Env Initialization
const env = new Env({ injectedDependencies: { envVars: process.env } });

// File-related Initializations
const filePath = new FilePath({
  injectedDependencies: { appRootPath: appRootPath.path, pathLib: path },
});

const file = new File({
  injectedDependencies: { fsLib: fs },
});

// Logger Initialization
const loggerDependencies: loggerTypes.LoggerDependencies = {
  debugLogFilePath: filePath.debugLogFilePath,
  isDeveloperEnv: env.isDeveloperEnv,
  loggerLib: winston,
};

const createLogger = () =>
  new Logger({
    injectedDependencies: loggerDependencies,
  });

// Spinner Initialization
const spinnerDependencies: spinnerTypes.SpinnerDependencies = {
  colorLib: chalk,
  consoleLib: console,
  logger: createLogger(),
  spinnerLib: ora,
};

const spinner = new Spinner({
  injectedDependencies: spinnerDependencies,
});

// Shell Initialization
const shellDependencies: shellTypes.ShellDependencies = {
  isDeveloperEnv: env.isDeveloperEnv,
  logger: createLogger(),
  shellLib: shell,
};
// eslint-disable-next-line @typescript-eslint/naming-convention
const _shell = new Shell({
  injectedDependencies: shellDependencies,
});

// Eth Initialization
const ethDependencies: ethTypes.EthDependencies = {
  ethLib: ethers,
  logger: createLogger(),
};
const eth = new Eth({ injectedDependencies: ethDependencies });

// Config Initialization
const tutorialConfig = new TutorialsConfigOrchestrator({
  injectedDependencies: {
    ethLib: eth,
    logger: createLogger(),
    lowdashLib: lowdash,
  },
  schema,
  tutorialsConfig,
});

// ChallengeParser Initialization
const challengeParser = new ChallengeParser({
  injectedDependencies: {
    jsonpLib: jp,
    logger: createLogger(),
  },
});

// Blockchain Initialization
const createBlockchainDeploy = ({ hre }: { hre: HardhatRuntimeEnvironment }) =>
  new BlockchainDeploy({
    hre,
    injectedDependencies: {
      bigNumberLib: BigNumber,
      ethLib: eth,
      logger: createLogger(),
    },
  });

export {
  _shell as shell,
  blockchainTypes,
  challengeParser,
  challengeParserTypes,
  createBlockchainDeploy,
  createLogger,
  env,
  envConst,
  envTypes,
  file,
  filePath,
  fileTypes,
  loggerTypes,
  shellTypes,
  spinner,
  spinnerTypes,
  tutorialConfig,
  tutorialConfigConst,
  tutorialConfigTypes,
};
