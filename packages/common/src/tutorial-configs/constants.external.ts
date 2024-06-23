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
  beginner = "Beginner Path",
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
  reentrancyFundamentalsAttackTheory = "reentrancyFundamentalsAttackTheory",
  reentrancyFundamentalsDefendPrompt = "reentrancyFundamentalsDefendPrompt",
  reentrancyFundamentalsDefendSolution = "reentrancyFundamentalsDefendSolution",
}

export enum TutorialName {
  reentrancyFundamentalsAttackPrompt = "Reentrancy Fundamentals: Attack Lab",
  reentrancyFundamentalsAttackSolution = "Reentrancy Fundamentals: Attack Lab (Solution)",
  reentrancyFundamentalsAttackTheory = "Reentrancy Fundamentals: Attack Theory",
  reentrancyFundamentalsDefendPrompt = "Reentrancy Fundamentals: Defend Lab",
  reentrancyFundamentalsDefendSolution = "Reentrancy Fundamentals: Defend Lab (Solution)",
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

/* AnchorGUID:
 * - A '#' is prepended via getAnchor
 * - Should correspond to docusaurus MDX headers
 * (e.g., # Hello {#INSERT_ANCHOR_GUID_HERE})
 * */
export enum AnchorGUID {
  code = "code",
  labChallenges = "labChallenges",
  labWorkflow = "labWorkflow",
  needHelp = "needHelp",
  processDiagram = "processDiagram",
  terminalSolution = "terminalSolution",
  tutorialSearch = "tutorialSearch",
}

// AnchorName: guid to name mapping
export enum AnchorName {
  code = "Code",
  labChallenges = "Lab Challenges",
  labWorkflow = "Lab Workflow",
  needHelp = "Need Help",
  processDiagram = "Process Diagram",
  terminalSolution = "Terminal Solution",
  tutorialSearch = "Tutorial Search",
}

export enum TutorialImageName {
  attackDiagram = "Attack Diagram",
  diagramExample = "Diagram Example",
  labEditorExample = "Editor Example",
  labSample = "Lab Sample",
  labTerminalExample = "Terminal Example",
}

export enum TutorialTypeName {
  attackLab = "Attack Lab",
  attackTheory = "Attack Theory",
  defendLab = "Defend Lab",
  defendTheory = "Defend Theory",
}

export enum ExecutionEnvironmentName {
  githubCodespace = "Github Codespace",
  visualStudioCode = "Visual Studio Code",
}
