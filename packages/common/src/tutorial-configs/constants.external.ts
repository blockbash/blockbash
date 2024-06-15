// Enums that are exported for DIRECT use in other modules

export enum AuthorName {
  ZachRoof = "zach roof",
}

export enum AttackDescriptions {
  "useAttackToSuccessfullyDrainFunds" = "should be able to steal all eth from Vulnerable Contract",
  "useAttackToUnsuccessfullyDrainFunds" = "should NOT be able to steal all eth from Vulnerable Contract",
  "useAttackWithRevert" = "should cause a revert event",
  "useAttackWithoutRevert" = "should not cause a revert event",
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

export enum DiagramConstructNames {
  deductionPhase = "Deduction Phase",
  seedingPhase = "Seeding Phase",
  transferPhase = "Transfer Phase",
}

export enum TutorialTypeGUID {
  attackLab = "attack_lab",
  defendLab = "defend_lab",
  theory = "theory",
}

// TutorialSectionGUID: Corresponds to a section header's anchor tag
export enum TutorialSectionGUID {
  code = "#code",
  diagram = "#diagram",
  labChallenges = "#challenges",
  labWorkflow = "#workflow",
  needHelp = "#need-help",
  terminalSolution = "#terminal-solution",
}
export enum TutorialSectionName {
  code = "Code",
  labChallenges = "Lab Challenges",
  labWorkflow = "Lab Workflow",
  needHelp = "Need Help?",
  processDiagram = "Process Diagram",
  terminalSolution = "Terminal Solution",
}

export enum TutorialImageName {
  attackDiagram = "Attack Diagram",
  labSample = "Lab Sample",
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
