// We expose Env (to other modules) as an instance.  Thus, methods can't be static.
/* eslint-disable class-methods-use-this */
// noinspection JSMethodCanBeStatic

import { EnvVarName, LabExecEnvGUID } from "./env.constants";
import { type EnvDependencies } from "./env.types";
import { envConst } from "./index";

// This class is initialized fairly early in the bootstrap process.
// Due to this, its injectedDependencies are minimal (i.e., no logger, etc.)

// This class handles fetching information from environment variables
export class Env {
  private readonly envVars: EnvDependencies["envVars"];

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: EnvDependencies;
  }) {
    this.envVars = injectedDependencies.envVars;
  }

  labExecEnvShellFormat({
    isInternalTestSuite,
  }: {
    isInternalTestSuite: boolean | undefined;
  }): string {
    const execEnvGUID = isInternalTestSuite
      ? LabExecEnvGUID.automation
      : LabExecEnvGUID.user;
    return `${envConst.EnvVarName.labExecEnv}=${execEnvGUID}`;
  }

  get currentLabExecEnv(): LabExecEnvGUID | undefined {
    return this.envVars[EnvVarName.labExecEnv] as LabExecEnvGUID | undefined;
  }

  get isDeveloperEnv(): boolean {
    return this.envVars[EnvVarName.nodeEnv] === "development";
  }

  get isValidLabExecEnv(): boolean {
    const envValue = this.currentLabExecEnv;
    if (typeof envValue === "undefined") {
      return false;
    }
    return Object.values(envConst.LabExecEnvGUID).includes(envValue);
  }
}
