import type { ShellString } from "shelljs";

import type { ShellDependencies } from "./shell.types";

export class Shell {
  private readonly isDeveloperEnv: ShellDependencies["isDeveloperEnv"];

  private readonly logger: ShellDependencies["logger"];

  private readonly shellLib: ShellDependencies["shellLib"];

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: ShellDependencies;
  }) {
    this.shellLib = injectedDependencies.shellLib;
    this.logger = injectedDependencies.logger;
    this.isDeveloperEnv = injectedDependencies.isDeveloperEnv;
    this.logger.setGlobalContext({
      className: Shell.name,
      logicPath: __filename,
    });
  }

  containsStderr(stderr: string) {
    // When debugging in IntelliJ, stderr somehow gets a debugger message that isn't an error
    if (
      stderr &&
      this.isDeveloperEnv &&
      stderr.toLowerCase().startsWith("debugger")
    ) {
      return false;
    }
    return stderr !== "";
  }

  execBashCommand({
    command,
    silent = true,
  }: {
    command: string;
    silent?: boolean;
  }): ShellString {
    this.logger.logInnerStartExecution({
      functionName: this.execBashCommand.name,
      metadata: {
        command,
        silent,
      },
    });
    return this.shellLib.exec(command, { silent });
  }

  stopProcess() {
    const exitCode = 1;
    this.logger.info({
      functionName: this.stopProcess.name,
      message: `Stopping the current process'`,
      metadata: {
        exitCode,
      },
    });
    this.shellLib.exit(exitCode);
  }
}
