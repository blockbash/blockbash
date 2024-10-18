import {
  Env,
  Eth,
  TutorialsConfigOrchestrator,
  envConst,
  envTypes,
  loggerConst,
  schema,
  tutorialConfigConst,
  tutorialConfigTypes,
  tutorialsConfig,
} from "@blockbash/common";
import { DependencyProvider } from "@src/providers/dependency";
import { Data } from "@src/utils/data";
import * as dataTypes from "@src/utils/data.types";
import { Logger } from "@src/utils/logger";
import { type CreateLogger } from "@src/utils/logger.types";
import { Navigation } from "@src/utils/navigation";
import * as navigationTypes from "@src/utils/navigation.types";
import { QueryString } from "@src/utils/queryString";
import * as queryStringConst from "@src/utils/queryString.const";
import * as queryStringTypes from "@src/utils/queryString.types";
import { ethers } from "ethers";
import Fuse from "fuse.js";
import lowdash from "lodash";
import { Logger as LoggerLib } from "tslog";

const createLogger: CreateLogger = (): Logger =>
  new Logger({
    injectedDependencies: { LoggerLib },
  });

const env = new Env({
  // process.env isn't available in the browser, but webpack replaces
  // process.env['NODE_ENV'] with the current env
  // https://docusaurus.io/docs/advanced/ssg#node-env
  injectedDependencies: { envVars: { NODE_ENV: process.env["NODE_ENV"] } },
});

const eth = new Eth({
  injectedDependencies: {
    ethLib: ethers,
    logger: createLogger(),
  },
});

const tutorialConfig = new TutorialsConfigOrchestrator({
  injectedDependencies: {
    ethLib: eth,
    logger: createLogger(),
    lowdashLib: lowdash,
  },
  schema,
  tutorialsConfig,
});

const queryString = new QueryString({
  injectedDependencies: {
    logger: createLogger(),
  },
});

const navigation = new Navigation({
  injectedDependencies: {
    logger: createLogger(),
  },
});

const data = new Data({
  injectedDependencies: {
    fuzzySearchLib: Fuse,
    logger: createLogger(),
  },
});

export {
  DependencyProvider,
  createLogger,
  data,
  dataTypes,
  env,
  envConst,
  envTypes,
  loggerConst,
  navigation,
  navigationTypes,
  queryString,
  queryStringConst,
  queryStringTypes,
  tutorialConfig,
  tutorialConfigConst,
  tutorialConfigTypes,
};
