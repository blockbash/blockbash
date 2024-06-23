// TODO: Should I change the casing for the file name?
// TODO: This shouldn't be so ugly
import buildChallengesConfig from "../../../../apps/build/artifacts/challenges/merged-metadata.json";
import { getChallengeURL } from "./configs";
import {
  AuthorName,
  ContractName,
  LearningPathGUID,
  LearningPathName,
  LearningPathURL,
  TutorialCategoryGUID,
  TutorialCategoryName,
  TutorialDifficultyName,
  TutorialGUID,
  TutorialName,
  TutorialTypeGUID,
  TutorialTypeName,
} from "./constants.external";
import {
  type CreateTutorialConfigDependencies,
  type TutorialsConfig,
} from "./types";
// Constants that are ONLY directly referenced inside this module (and within
// instantiation code within common.src.index.ts) If these data structures need
// to be accessed via other modules, you should deploy getters within exported
// classes (e.g., TutorialsConfigOrchestrator)
export enum ChallengeURLTypeGUID {
  codespaceURL = "codespace_url",
  vscodeURL = "vscode_url",
}

const contractConfigs = {
  attacker: {
    ethAmount: 1,
    name: ContractName.Attacker,
    proxy: false,
  },
  attackerSolution: {
    ethAmount: 1,
    name: ContractName.AttackerSolution,
    proxy: false,
  },
  vulnerable: {
    ethAmount: 10,
    name: ContractName.Vulnerable,
    proxy: false,
  },
  vulnerableSolution: {
    ethAmount: 10,
    name: ContractName.VulnerableSolution,
    proxy: false,
  },
};

const contentCategoryConfigs = {
  reentrancy: {
    guid: TutorialCategoryGUID.reentrancy,
    name: TutorialCategoryName.reentrancy,
  },
};

const contentTypeConfigs = {
  attackLab: {
    guid: TutorialTypeGUID.attackLab,
    name: TutorialTypeName.attackLab,
  },
  defendLab: {
    guid: TutorialTypeGUID.defendLab,
    name: TutorialTypeName.defendLab,
  },
  theory: {
    guid: TutorialTypeGUID.theory,
    name: TutorialTypeName.attackTheory,
  },
};

const learningPathConfig = {
  beginner: {
    guid: LearningPathGUID.beginner,
    name: LearningPathName.beginner,
    url: LearningPathURL.beginner,
  },
};

const reentrancyFundamentalsChallengeTextReplacements = [
  {
    matchRegex: "\\<.*UnknownFunction.*\\>",
    replaceWithText: "receive()",
  },
  {
    matchRegex: "AttackerSolution",
    replaceWithText: "Attacker",
  },
];

const createTutorialsConfig = ({
  injectedDependencies,
}: {
  injectedDependencies: CreateTutorialConfigDependencies;
}) => {
  return [
    {
      authorName: AuthorName.ZachRoof,
      categories: [contentCategoryConfigs.reentrancy],
      description:
        "In this tutorial, you'll learn the theory behind Reentrancy attacks.  In particular, you'll learn how the Attacker Contract will unexpectedly call (or \"re-enter\") the Vulnerable Contract before the Vulnerable Contract has updated its state.",
      difficultyName: TutorialDifficultyName.beginner,
      durationMinutes: 30,
      guid: TutorialGUID.reentrancyFundamentalsAttackTheory,
      learningPath: learningPathConfig.beginner,
      name: TutorialName.reentrancyFundamentalsAttackTheory,
      publishedDate: new Date(2024, 4, 21),
      type: contentTypeConfigs.theory,
      url: "/tutorials/reentrancy-fundamentals-attack-theory",
    },
    {
      authorName: AuthorName.ZachRoof,
      categories: [contentCategoryConfigs.reentrancy],
      challengeTextReplacements:
        reentrancyFundamentalsChallengeTextReplacements,
      description:
        "In this lab, you'll leverage your Reentrancy knowledge to steal eth from the Vulnerable Contract",
      difficultyName: TutorialDifficultyName.beginner,
      durationMinutes: 30,
      guid: TutorialGUID.reentrancyFundamentalsAttackPrompt,
      lab: {
        codespaceURL: injectedDependencies.getLabURL({
          buildChallenges: injectedDependencies.buildChallenges,
          challengeGUIDTypescript:
            TutorialGUID.reentrancyFundamentalsAttackPrompt,
          challengeURLTypeGUID: ChallengeURLTypeGUID.codespaceURL,
        }),
        contracts: [contractConfigs.attacker, contractConfigs.vulnerable],
        vscodeURL: injectedDependencies.getLabURL({
          buildChallenges: injectedDependencies.buildChallenges,
          challengeGUIDTypescript:
            TutorialGUID.reentrancyFundamentalsAttackPrompt,
          challengeURLTypeGUID: ChallengeURLTypeGUID.vscodeURL,
        }),
      },
      learningPath: learningPathConfig.beginner,
      name: TutorialName.reentrancyFundamentalsAttackPrompt,
      publishedDate: new Date(2024, 4, 21),

      type: contentTypeConfigs.attackLab,
      url: "/tutorials/reentrancy-fundamentals-attack-lab",
    },
    {
      authorName: AuthorName.ZachRoof,
      categories: [contentCategoryConfigs.reentrancy],
      challengeTextReplacements:
        reentrancyFundamentalsChallengeTextReplacements,
      description: "In this lesson, you'll review the Attack Lab's solution.",
      difficultyName: TutorialDifficultyName.beginner,
      durationMinutes: 15,
      guid: TutorialGUID.reentrancyFundamentalsAttackSolution,
      lab: {
        codespaceURL: injectedDependencies.getLabURL({
          buildChallenges: injectedDependencies.buildChallenges,
          challengeGUIDTypescript:
            TutorialGUID.reentrancyFundamentalsAttackPrompt,
          challengeURLTypeGUID: ChallengeURLTypeGUID.codespaceURL,
        }),
        contracts: [
          contractConfigs.attackerSolution,
          contractConfigs.vulnerable,
        ],
        vscodeURL: injectedDependencies.getLabURL({
          buildChallenges: injectedDependencies.buildChallenges,
          challengeGUIDTypescript:
            TutorialGUID.reentrancyFundamentalsAttackPrompt,
          challengeURLTypeGUID: ChallengeURLTypeGUID.vscodeURL,
        }),
      },
      learningPath: learningPathConfig.beginner,
      name: TutorialName.reentrancyFundamentalsAttackSolution,
      publishedDate: new Date(2024, 4, 27),
      type: contentTypeConfigs.attackLab,
      url: "/tutorials/reentrancy-fundamentals-attack-lab-solution",
    },
    // {
    //   authorName: AuthorName.ZachRoof,
    //   categories: [contentCategoryConfigs.reentrancy],
    //   challengeTextReplacements:
    // reentrancyFundamentalsChallengeTextReplacements, description:
    // "Reentrancy
    // Fundamentals Defend Lab", difficultyName:
    // TutorialDifficultyName.beginner, durationMinutes: 15, guid:
    // TutorialGUID.reentrancyFundamentalsDefendPrompt, lab: { contracts:
    // [contractConfigs.vulnerable, contractConfigs.attackerSolution], url: "",
    // }, learningPath: learningPathConfig.beginner, name:
    // TutorialName.reentrancyFundamentalsDefendPrompt, publishedDate: new
    // Date(1995, 11, 17), type: contentTypeConfigs.defendLab, url:
    // "/tutorials/reentrancy-fundamentals-defend-lab", }, { authorName:
    // AuthorName.ZachRoof, categories: [contentCategoryConfigs.reentrancy],
    // challengeTextReplacements:
    // reentrancyFundamentalsChallengeTextReplacements, description:
    // "Reentrancy Fundamentals Defend Lab Solution", difficultyName:
    // TutorialDifficultyName.beginner, durationMinutes: 15, guid:
    // TutorialGUID.reentrancyFundamentalsDefendSolution, lab: { contracts: [
    // contractConfigs.vulnerableSolution, contractConfigs.attackerSolution, ],
    // url: "", }, learningPath: learningPathConfig.beginner, name:
    // TutorialName.reentrancyFundamentalsDefendSolution, publishedDate: new
    // Date(1995, 11, 17), type: contentTypeConfigs.defendLab, url:
    // "/tutorials/reentrancy-fundamentals-defend-lab", },
  ] as TutorialsConfig;
};

export const tutorialsConfig = createTutorialsConfig({
  injectedDependencies: {
    buildChallenges: buildChallengesConfig,
    getLabURL: getChallengeURL,
  },
});
