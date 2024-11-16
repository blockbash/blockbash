import type Mochawesome from "mochawesome";

import {
  challengeParser,
  createLogger,
  env,
  file,
  filePath,
  shell,
  spinner,
  tutorialConfig,
  type tutorialConfigTypes,
} from "@blockbash/common-be";

import { createChallengeReporter } from "../challengeReporter";
import { type CommanderOption } from "../main.types";
import { type ChallengeDependencies } from "./challenge.types";

enum SpinnerNames {
  CHALLENGE_INIT = "CHALLENGE_INIT",
  CHALLENGE_OUTPUT = "CHALLENGE_OUTPUT",
  TRACE_OUTPUT = "TRACE_OUTPUT",
}

enum Github {
  createIssueURL = "https://github.com/blockbash/blockbash/issues/new/choose",
}

export function createChallenges(): Challenges {
  return new Challenges({
    injectedDependencies: {
      challengeParser,
      createChallengeReporter,
      env,
      file,
      filePath,
      logger: createLogger(),
      shell,
      spinner,
      tutorialConfig,
    },
  });
}

/**
 * Main orchestrator for challenge-related logic
 */
class Challenges {
  private readonly challengeParser: ChallengeDependencies["challengeParser"];

  private readonly createChallengeReporter: ChallengeDependencies["createChallengeReporter"];

  private readonly env: ChallengeDependencies["env"];

  private readonly file: ChallengeDependencies["file"];

  private readonly filePath: ChallengeDependencies["filePath"];

  private readonly logger: ChallengeDependencies["logger"];

  private readonly shell: ChallengeDependencies["shell"];

  private readonly spinner: ChallengeDependencies["spinner"];

  private readonly tutorialConfig: ChallengeDependencies["tutorialConfig"];

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: ChallengeDependencies;
  }) {
    this.filePath = injectedDependencies.filePath;
    this.logger = injectedDependencies.logger;
    this.shell = injectedDependencies.shell;
    this.tutorialConfig = injectedDependencies.tutorialConfig;
    this.spinner = injectedDependencies.spinner;
    this.env = injectedDependencies.env;
    this.file = injectedDependencies.file;
    this.challengeParser = injectedDependencies.challengeParser;
    this.createChallengeReporter = injectedDependencies.createChallengeReporter;
    this.logger.setGlobalContext({
      className: Challenges.name,
      logicPath: __filename,
    });
  }

  public execute(
    challengeGroupGUID: tutorialConfigTypes.ChallengeGroupGUID,
    isInternalTestSuite: CommanderOption,
  ): void {
    // TODO: Modularize #execute. Expose each action as a function so testing
    // is easier.

    const challengeGroup = tutorialConfig.getChallengeGroup(challengeGroupGUID);

    this.logger.logInnerStartExecution({
      functionName: this.execute.name,
    });
    const textReplacements = challengeGroup.textReplacements;

    this.spinner.start({
      name: SpinnerNames.CHALLENGE_INIT,
      spinnerText: "Initializing challenge verification engine...",
    });

    const shellOutput = this.shell.execBashCommand({
      // 1) Chain all commands together with && so evaluation will stop if
      // there's an error 2) FORCE_COLOR ensures that chalk (leveraged by
      // hardhat) will output colored text
      // https://github.com/chalk/chalk/tree/a370f468a43999e4397094ff5c3d17aadcc4860e#supportscolor
      // 3) We don't leverage npm run scripts (for the `hardhat test`
      // execution) as it adds an additional layer of indirection which can add
      // unexpected results (e.g., STDERR from run script going to the console
      // on an incorrect solution, progress bar of script execution being
      // shown, etc.)
      command: `rm -rf ${this.filePath.challengeResultsFilePath} &&\
      cd ${this.filePath.challengeGroupsDirPath} &&\
      ${this.env.labExecEnvShellFormat({
        isInternalTestSuite,
      })} FORCE_COLOR=1 pnpm exec hardhat test ${
        this.filePath.challengeGroupsDirPath
      }/${challengeGroup.guid}.spec.ts --trace`,
    });

    // Handle hardhat cli related errors/warnings
    // When debugging in IntelliJ, stderr somehow gets a
    // debugger message that isn't an error
    if (this.shell.containsStderr(shellOutput.stderr)) {
      this.spinner.failure({
        // This 'failure' could occur from a user error.
        // For example, if their contract has errors and doesn't
        // compile correctly
        isErrorCondition: false,
        name: SpinnerNames.CHALLENGE_INIT,
        primarySpinnerText:
          "ChallengeParser verification failed because the initialization process created an error (below).  Please fix the error to proceed.",
        secondarySpinnerText: shellOutput.stderr,
      });
      this.shell.stopProcess();
    } else {
      this.spinner.success({
        name: SpinnerNames.CHALLENGE_INIT,
      });
    }

    this.spinner.start({
      name: SpinnerNames.TRACE_OUTPUT,
      spinnerText: "Generating Call Trace...",
    });

    const mochaOutputJSON = this.file.parseJSON({
      path: this.filePath.challengeResultsFilePath,
    }) as Mochawesome.Output;
    const failedChallenges = this.challengeParser.getFailedChallenges({
      json: mochaOutputJSON,
    });
    const reporter = this.createChallengeReporter({
      failedChallenges,
    });
    const traceOutput = this.challengeParser.applyTextReplacements({
      stdout: shellOutput.stdout,
      textReplacements,
    });
    file.writeFile({
      content: traceOutput,
      path: `${filePath.labCoreOutputsTracesDirPath}/${challengeGroupGUID}.txt`,
    });

    // The trace should always contain a contract call
    if (traceOutput.toLowerCase().includes("call")) {
      this.spinner.success({
        appendConsoleText: traceOutput,
        name: SpinnerNames.TRACE_OUTPUT,
      });
    } else {
      this.spinner.failure({
        isErrorCondition: true,
        name: SpinnerNames.TRACE_OUTPUT,
        primarySpinnerText: `Contract call trace failed to load.  Please file a Github Issue at ${Github.createIssueURL}}`,
      });
    }
    this.spinner.start({
      name: SpinnerNames.CHALLENGE_OUTPUT,
      spinnerText: "Verifying solution...",
    });

    // Handle challenge-related output
    if (failedChallenges.length === 0) {
      this.spinner.success({
        name: SpinnerNames.CHALLENGE_OUTPUT,
        spinnerText:
          "You passed the lab! Great job! Feel free to move onto the next lesson",
      });
    } else if (failedChallenges.length > 0) {
      this.spinner.failure({
        isErrorCondition: false,
        name: SpinnerNames.CHALLENGE_OUTPUT,
        primarySpinnerText:
          "You didn't pass the lab.  Please use the 'Challenge Failures' (below) to improve your solution. You can also leverage the 'Call Trace' (above) to understand the execution flow of your submission.  For further help, please review the lab's 'Need Help?' section.",
        secondarySpinnerText: reporter.stringifyFailedChallenges(),
      });
    } else {
      this.logger.error({
        functionName: this.execute.name,
        message: `failedChallenges in an abnormal state.  Please file a Github Issue at ${Github.createIssueURL}}`,
        metadata: { failedChallenges, mochaOutputJSON, traceOutput },
      });
    }
  }
}
