import type ora from "ora"

import type { Log } from "./logger.types"
import type { SpinnerDependencies } from "./spinner.types"

export class Spinner {
  private readonly colorLib: SpinnerDependencies["colorLib"]

  private readonly consoleLib: SpinnerDependencies["consoleLib"]

  private readonly logger: SpinnerDependencies["logger"]

  private readonly spinnerLib: SpinnerDependencies["spinnerLib"]

  private spinners: Record<string, ora.Ora> = {}

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: SpinnerDependencies
  }) {
    this.spinnerLib = injectedDependencies.spinnerLib
    this.logger = injectedDependencies.logger
    this.colorLib = injectedDependencies.colorLib
    this.consoleLib = injectedDependencies.consoleLib
    this.logger.setGlobalContext({
      className: Spinner.name,
      logicPath: __filename,
    })
  }

  private isSpinnerInCorrectState({
    name,
    shouldExist,
  }: {
    name: string
    shouldExist: boolean
  }) {
    if (shouldExist) {
      return typeof this.spinners[name] !== "undefined"
    }
    return typeof this.spinners[name] === "undefined"
  }

  private logBasedOnError({
    isErrorCondition,
    log,
  }: {
    isErrorCondition: boolean
    log: Log
  }) {
    return isErrorCondition ? this.logger.error(log) : this.logger.info(log)
  }

  failure({
    isErrorCondition,
    name,
    primarySpinnerText,
    secondarySpinnerText = "",
  }: {
    isErrorCondition: boolean
    name: string
    primarySpinnerText: string
    secondarySpinnerText?: string
  }) {
    const message = `${this.colorLib.red.bold.underline(
      "IMPORTANT",
    )}${this.colorLib.red(":")} ${this.colorLib.bold(
      primarySpinnerText,
    )}\n${secondarySpinnerText}`

    const sharedLoggerArgsBase = {
      functionName: this.failure.name,
      message,
      metadata: {
        isErrorCondition,
        message,
        name,
      },
    }

    if (this.isSpinnerInCorrectState({ name, shouldExist: true })) {
      this.spinners[name]?.fail(message)
      this.logBasedOnError({ isErrorCondition, log: sharedLoggerArgsBase })
    } else {
      this.logger.warn({
        functionName: this.failure.name,
        message: "Spinner not found",
      })
      this.logBasedOnError({
        isErrorCondition,
        log: { ...sharedLoggerArgsBase, toUser: true },
      })
    }
  }

  start({ name, spinnerText }: { name: string; spinnerText: string }) {
    // Insert new line
    this.consoleLib.log()
    const spinnerCheckArgs = {
      functionName: this.start.name,
      metadata: { name, spinnerText },
    }
    if (this.isSpinnerInCorrectState({ name, shouldExist: false })) {
      this.logger.info({
        ...spinnerCheckArgs,
        message: `Starting spinner`,
      })
      this.spinners[name] = this.spinnerLib({ text: spinnerText }).start()
    } else {
      this.logger.warn({
        ...spinnerCheckArgs,
        message: `Spinner started twice`,
      })
    }
  }

  success({
    appendConsoleText,
    name,
    spinnerText,
  }: {
    appendConsoleText?: string
    name: string
    spinnerText?: string
  }) {
    const spinnerCheckArgs = {
      functionName: this.success.name,
      metadata: {
        appendConsoleText: String(appendConsoleText),
        name,
        spinnerText: String(spinnerText),
      },
    }
    if (this.isSpinnerInCorrectState({ name, shouldExist: true })) {
      this.spinners[name]?.succeed(spinnerText)
      this.logger.info({
        ...spinnerCheckArgs,
        message: `Spinner given a successful status.`,
      })
    } else {
      this.logger.warn({
        ...spinnerCheckArgs,
        message: `Spinner was not found.`,
      })
    }

    if (typeof appendConsoleText !== "undefined") {
      this.logger.info({
        functionName: this.success.name,
        message: appendConsoleText,
        toUser: true,
      })
    }
  }

  warn({
    name,
    spinnerText,
    stderr,
  }: {
    name: string
    spinnerText: string
    stderr: string
  }) {
    const warnMsg = `${this.colorLib.bold(
      "Warning:",
    )} ${spinnerText}\n${stderr.replace(/\n/g, " ")}`
    const sharedLoggerArgs = {
      functionName: this.warn.name,
      metadata: {
        name,
        spinnerText: String(spinnerText),
        stderr,
      },
    }
    if (this.isSpinnerInCorrectState({ name, shouldExist: true })) {
      this.spinners[name]?.warn(warnMsg)
    } else {
      this.logger.warn({
        ...sharedLoggerArgs,
        message: `Spinner was not found.`,
      })
      this.logger.info({
        ...sharedLoggerArgs,
        message: warnMsg,
        toUser: true,
      })
    }
  }
}
