// TODO: Should I change the casing for the file name?
// TODO: This shouldn't be so ugly
import buildLabsConfig from "../../../../apps/build/artifacts/labs/merged-metadata.json";
import { getCodespaceLabURL, getVSCodeLabURL } from "./configs";
import {
  AuthorName,
  ChallengeGroupGUID,
  ContractName,
  LabGUIDBash,
  PlaylistGUID,
  PlaylistName,
  PlaylistURLPath,
  TutorialCategoryGUID,
  TutorialCategoryName,
  TutorialDifficultyName,
  TutorialGUID,
  TutorialName,
  TutorialTypeGUID,
  TutorialTypeName,
} from "./constants.external";
import { reentrancyFundamentalsTextReplacements } from "./constants/reentrancyFundamentals";
import {
  type CreateTutorialConfigDependencies,
  type TutorialsConfig,
} from "./types";
// Constants that are ONLY directly referenced inside this module (and within
// instantiation code within common.src.index.ts) If these data structures need
// to be accessed via other modules, you should deploy getters within exported
// classes (e.g., TutorialsConfigOrchestrator)

const baseVulnerableContractConfigs = {
  ethAmount: 10,
  proxy: false,
};

const baseAttackerContractConfigs = {
  ethAmount: 1,
  proxy: false,
};
const contractConfigs = {
  attacker: {
    name: ContractName.Attacker,
    ...baseAttackerContractConfigs,
  },
  attackerSolutionPattern0: {
    name: ContractName.AttackerSolutionPattern0,
    ...baseAttackerContractConfigs,
  },
  vulnerable: {
    name: ContractName.Vulnerable,
    ...baseVulnerableContractConfigs,
  },
  vulnerableSolutionPattern0: {
    name: ContractName.VulnerableSolutionPattern0,
    ...baseVulnerableContractConfigs,
  },
  vulnerableSolutionPattern1: {
    name: ContractName.VulnerableSolutionPattern1,
    ...baseVulnerableContractConfigs,
  },
  vulnerableSolutionPattern2: {
    name: ContractName.VulnerableSolutionPattern2,
    ...baseVulnerableContractConfigs,
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
  attackTheory: {
    guid: TutorialTypeGUID.attackTheory,
    name: TutorialTypeName.attackTheory,
  },
  defendLab: {
    guid: TutorialTypeGUID.defendLab,
    name: TutorialTypeName.defendLab,
  },
  defendTheory: {
    guid: TutorialTypeGUID.defendTheory,
    name: TutorialTypeName.defendTheory,
  },
};

const playlistConfig = {
  beginner: {
    guid: PlaylistGUID.beginner,
    name: PlaylistName.beginner,
    url: PlaylistURLPath.beginner,
  },
};

const createTutorialsConfig = ({
  injectedDependencies,
}: {
  injectedDependencies: CreateTutorialConfigDependencies;
}) => {
  const labUrls = {
    reentrancyFundamentalsAttack: {
      codespaceURL: injectedDependencies.getCodespaceLabURL({
        buildLabsConfig: injectedDependencies.buildLabsConfig,
        labGUIDBash: LabGUIDBash.reentrancyFundamentalsAttack,
      }),
      vscodeURL: injectedDependencies.getVSCodeLabURL({
        buildLabsConfig: injectedDependencies.buildLabsConfig,
        labGUIDBash: LabGUIDBash.reentrancyFundamentalsAttack,
      }),
    },
    reentrancyFundamentalsDefend: {
      codespaceURL: injectedDependencies.getCodespaceLabURL({
        buildLabsConfig: injectedDependencies.buildLabsConfig,
        labGUIDBash: LabGUIDBash.reentrancyFundamentalsDefend,
      }),
      vscodeURL: injectedDependencies.getVSCodeLabURL({
        buildLabsConfig: injectedDependencies.buildLabsConfig,
        labGUIDBash: LabGUIDBash.reentrancyFundamentalsDefend,
      }),
    },
  };
  return [
    {
      authorName: AuthorName.ZachRoof,
      categories: [contentCategoryConfigs.reentrancy],
      description:
        "In this lesson, you'll learn the theory behind Reentrancy attacks.  In particular, you'll learn how the Attacker Contract will unexpectedly call (or \"re-enter\") the Vulnerable Contract before the Vulnerable Contract has updated its state.",
      difficultyName: TutorialDifficultyName.beginner,
      durationMinutes: 30,
      guid: TutorialGUID.reentrancyFundamentalsAttackTheory,
      name: TutorialName.reentrancyFundamentalsAttackTheory,
      playlist: playlistConfig.beginner,
      publishedDate: new Date(2024, 4, 21),
      type: contentTypeConfigs.attackTheory,
      url: "/tutorials/reentrancy-fundamentals-attack-theory",
    },
    {
      authorName: AuthorName.ZachRoof,
      categories: [contentCategoryConfigs.reentrancy],
      description:
        "In this lab, you'll leverage your Reentrancy knowledge to steal funds from the Vulnerable Contract.",
      difficultyName: TutorialDifficultyName.beginner,
      durationMinutes: 30,
      guid: TutorialGUID.reentrancyFundamentalsAttackLab,
      lab: {
        challengeGroups: [
          {
            guid: ChallengeGroupGUID.reentrancyFundamentalsAttackPrompt,
            textReplacements: reentrancyFundamentalsTextReplacements,
          },
          {
            guid: ChallengeGroupGUID.reentrancyFundamentalsAttackSolutionPattern0,
            textReplacements: reentrancyFundamentalsTextReplacements,
          },
        ],
        contracts: [
          contractConfigs.attacker,
          contractConfigs.attackerSolutionPattern0,
          contractConfigs.vulnerable,
        ],
        ...labUrls.reentrancyFundamentalsAttack,
      },
      name: TutorialName.reentrancyFundamentalsAttackLab,
      playlist: playlistConfig.beginner,
      publishedDate: new Date(2024, 4, 21),
      type: contentTypeConfigs.attackLab,
      url: "/tutorials/reentrancy-fundamentals-attack-lab",
    },
    {
      authorName: AuthorName.ZachRoof,
      categories: [contentCategoryConfigs.reentrancy],
      description: "In this lesson, you'll review the Attack Lab's solution.",
      difficultyName: TutorialDifficultyName.beginner,
      durationMinutes: 15,
      guid: TutorialGUID.reentrancyFundamentalsAttackLabSolution,
      name: TutorialName.reentrancyFundamentalsAttackLabSolution,
      playlist: playlistConfig.beginner,
      publishedDate: new Date(2024, 4, 27),
      type: contentTypeConfigs.attackLab,
      url: "/tutorials/reentrancy-fundamentals-attack-lab-solution",
    },
    {
      authorName: AuthorName.ZachRoof,
      categories: [contentCategoryConfigs.reentrancy],
      description:
        "In this tutorial, you'll learn the theory behind Reentrancy defense.",
      difficultyName: TutorialDifficultyName.beginner,
      durationMinutes: 30,
      guid: TutorialGUID.reentrancyFundamentalsDefendTheory,
      name: TutorialName.reentrancyFundamentalsDefendTheory,
      playlist: playlistConfig.beginner,
      publishedDate: new Date(2024, 4, 21),
      type: contentTypeConfigs.defendTheory,
      url: "/tutorials/reentrancy-fundamentals-defend-theory",
    },
    {
      authorName: AuthorName.ZachRoof,
      categories: [contentCategoryConfigs.reentrancy],
      description: "Reentrancy Fundamentals Defend Lab",
      difficultyName: TutorialDifficultyName.beginner,
      durationMinutes: 15,
      guid: TutorialGUID.reentrancyFundamentalsDefendLab,
      lab: {
        challengeGroups: [
          {
            guid: ChallengeGroupGUID.reentrancyFundamentalsDefendPrompt,
          },
          {
            guid: ChallengeGroupGUID.reentrancyFundamentalsDefendSolutionPattern0,
          },
          {
            guid: ChallengeGroupGUID.reentrancyFundamentalsDefendSolutionPattern1,
          },
          {
            guid: ChallengeGroupGUID.reentrancyFundamentalsDefendSolutionPattern2,
          },
          {
            guid: ChallengeGroupGUID.reentrancyFundamentalsDefendSolutionPattern3,
          },
        ],
        contracts: [
          contractConfigs.attackerSolutionPattern0,
          contractConfigs.vulnerable,
          contractConfigs.vulnerableSolutionPattern0,
          contractConfigs.vulnerableSolutionPattern1,
          contractConfigs.vulnerableSolutionPattern2,
        ],
        ...labUrls.reentrancyFundamentalsDefend,
      },
      name: TutorialName.reentrancyFundamentalsDefendLab,
      playlist: playlistConfig.beginner,
      publishedDate: new Date(1995, 11, 17),
      type: contentTypeConfigs.defendLab,
      url: "/tutorials/reentrancy-fundamentals-defend-lab",
    },
    {
      authorName: AuthorName.ZachRoof,
      categories: [contentCategoryConfigs.reentrancy],
      description: "Reentrancy Fundamentals Defend Lab Solution",
      difficultyName: TutorialDifficultyName.beginner,
      durationMinutes: 15,
      guid: TutorialGUID.reentrancyFundamentalsDefendLabSolution,
      name: TutorialName.reentrancyFundamentalsDefendLabSolution,
      playlist: playlistConfig.beginner,
      publishedDate: new Date(1995, 11, 17),
      type: contentTypeConfigs.defendLab,
      url: "/tutorials/reentrancy-fundamentals-defend-lab-solution",
    },
  ] as TutorialsConfig;
};

export const tutorialsConfig = createTutorialsConfig({
  injectedDependencies: {
    buildLabsConfig,
    getCodespaceLabURL,
    getVSCodeLabURL,
  },
});
