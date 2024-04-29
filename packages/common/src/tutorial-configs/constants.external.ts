// Enums that are exported for DIRECT use in other modules

export enum AuthorName {
  ZachRoof = "zach roof",
}

// guid to name mapping
export enum ContractName {
  "Attacker" = "Attacker",
  "AttackerSolution" = "AttackerSolution",
  "Vulnerable" = "Vulnerable",
  "VulnerableSolution" = "VulnerableSolution",
}

export enum DeployAccountGUID {
  // The first account declared is the default account
  default = 0,
}

export enum LearningPathGUID {
  beginner = "beginner",
}

export enum LearningPathName {
  beginner = "beginner path",
}

export enum LearningPathURL {
  beginner = "beginner-path",
}

export enum TutorialCategoryGUID {
  reentrancy = "reentrancy",
}

export enum TutorialCategoryName {
  reentrancy = "reentrancy",
}

// guid to name mapping
export enum TutorialDifficultyName {
  advanced = "Advanced",
  beginner = "Beginner",
  intermediate = "Intermediate",
}

export enum TutorialGUID {
  reentrancyFundamentalsAttackPrompt = "reentrancyFundamentalsAttackPrompt",
  reentrancyFundamentalsAttackSolution = "reentrancyFundamentalsAttackSolution",
  reentrancyFundamentalsDefendPrompt = "reentrancyFundamentalsDefendPrompt",
  reentrancyFundamentalsDefendSolution = "reentrancyFundamentalsDefendSolution",
  reentrancyFundamentalsTheory = "reentrancyFundamentalsTheory",
}

export enum TutorialName {
  reentrancyFundamentalsAttackPrompt = "Reentrancy Fundamentals: Attack Lab",
  reentrancyFundamentalsAttackSolution = "Reentrancy Fundamentals: Attack Lab (Solution)",
  reentrancyFundamentalsDefendPrompt = "Reentrancy Fundamentals: Defend Lab",
  reentrancyFundamentalsDefendSolution = "Reentrancy Fundamentals: Defend Lab (Solution)",
  reentrancyFundamentalsTheory = "Reentrancy Fundamentals: Theory",
}

export enum TutorialTypeGUID {
  attackLab = "attack_lab",
  defendLab = "defend_lab",
  theory = "theory",
}

export enum TutorialTypeName {
  attackLab = "attack lab",
  defendLab = "defend lab",
  theory = "theory",
}

export enum ExecutionEnvironmentName {
  githubCodespace = "Github Codespace",
  visualStudioCode = "Visual Studio Code",
}
