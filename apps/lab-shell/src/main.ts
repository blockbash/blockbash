/**
 * Main entrypoint to cli
 */
import { tutorialConfig } from "@blockbash/common-be"
import { Argument, Option, program } from "@commander-js/extra-typings"

import { createChallenge } from "./commands/challenge"

const challengeSubCommand = program.command("challenge")

challengeSubCommand
  .command("verify")
  .addArgument(
    new Argument("<tutorialGUID>").choices(tutorialConfig.tutorialGUIDs),
  )
  .addOption(
    new Option(
      "-t, --test-suite",
      "Leveraged for running internal test suite",
    ).hideHelp(),
  )
  .action((tutorialGUID, options) => {
    createChallenge().execute(tutorialGUID, options.testSuite)
  })

program.parse()
