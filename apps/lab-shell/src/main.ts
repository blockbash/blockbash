/**
 * Main entrypoint to cli
 */
import { tutorialConfig } from "@blockbash/common-be";
import { Argument, Option, program } from "@commander-js/extra-typings";
import { createChallenges } from "src/commands/challenges";
const challengesSubCommand = program.command("challenges");

challengesSubCommand
  .command("verify")
  .addArgument(
    new Argument("<challengeGroupGUID>").choices(
      tutorialConfig.challengeGroupGUIDs,
    ),
  )
  .addOption(
    new Option(
      "-t, --test-suite",
      "Leveraged for executing internal test suite",
    ).hideHelp(),
  )
  .action((challengeGroupGUID, options) => {
    createChallenges().execute(challengeGroupGUID, options.testSuite);
  });

program.parse();
