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
    name: TutorialTypeName.theory,
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
    matchRegex: "\\<.*UnknownFunction.*0x\\)",
    replaceWithText: "receive()",
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
      description: "Reentrancy Fundamentals Theory",
      difficultyName: TutorialDifficultyName.beginner,
      durationMinutes: 15,
      guid: TutorialGUID.reentrancyFundamentalsTheory,
      learningPath: learningPathConfig.beginner,
      name: TutorialName.reentrancyFundamentalsTheory,
      publishedDate: new Date(2024, 4, 21),
      type: contentTypeConfigs.theory,
      url: "/tutorials/reentrancy-fundamentals-theory",
    },
    {
      authorName: AuthorName.ZachRoof,
      categories: [contentCategoryConfigs.reentrancy],
      challengeTextReplacements:
        reentrancyFundamentalsChallengeTextReplacements,
      description: "Reentrancy Fundamentals Attack Lab",
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
    // {
    //   authorName: AuthorName.ZachRoof,
    //   categories: [contentCategoryConfigs.reentrancy],
    //   challengeTextReplacements:
    //     reentrancyFundamentalsChallengeTextReplacements,
    //   description: "Reentrancy Fundamentals Attack Lab Solution",
    //   difficultyName: TutorialDifficultyName.beginner,
    //   durationMinutes: 15,
    //   guid: TutorialGUID.reentrancyFundamentalsAttackSolution,
    //   lab: {
    //     contracts: [
    //       contractConfigs.vulnerable,
    //       contractConfigs.attackerSolution,
    //     ],
    //     vscodeURL: injectedDependencies.getLabURL({
    //       buildChallengesConfig: injectedDependencies.buildChallengesConfig,
    //       challengeGUIDTypescript:
    //         TutorialGUID.reentrancyFundamentalsAttackPrompt,
    //       challengeURLTypeGUID: ChallengeURLTypeGUID.vscodeURL
    //     }),
    //   },
    //   learningPath: learningPathConfig.beginner,
    //   name: TutorialName.reentrancyFundamentalsAttackSolution,
    //   publishedDate: new Date(1995, 11, 17),
    //   type: contentTypeConfigs.attackLab,
    //   url: "/tutorials/reentrancy-fundamentals-attack-lab-solution",
    // },
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
  injectedDependencies: { buildChallenges: buildChallengesConfig, getLabURL: getChallengeURL },
});
