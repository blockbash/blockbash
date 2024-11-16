// Enums that are exported for DIRECT use in other modules

export enum AuthorName {
  ZachRoof = "zach roof",
}

export enum ChallengeDescriptions {
  "shouldBeAbleToStealAllEthFromVulnerableContract" = "Attacker.sol should be able to steal all ETH from Vulnerable.sol",
  "shouldNotBeAbleToStealAllEthFromVulnerableContract" = "Attacker.sol should NOT be able to steal all ETH from Vulnerable.sol",
  "shouldNotCauseARevertOperation" = "Attacker.sol should not cause a revert operation",
}

export enum ContractFileName {
  Attacker = "Attacker.sol",
  Vulnerable = "Vulnerable.sol",
}

// guid to name mapping
export enum ContractName {
  "Attacker" = "Attacker",
  "AttackerSolutionPattern0" = "AttackerSolutionPattern0",
  "Vulnerable" = "Vulnerable",
  "VulnerableSolutionPattern0" = "VulnerableSolutionPattern0",
  "VulnerableSolutionPattern1" = "VulnerableSolutionPattern1",
  "VulnerableSolutionPattern2" = "VulnerableSolutionPattern2",
}

export enum DeployAccountGUID {
  // The first account declared is the default account
  default = 0,
}

export enum PlaylistGUID {
  beginner = "beginner",
}

export enum PlaylistName {
  beginner = "Beginner Path",
}

export enum PlaylistURLPath {
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

export enum LabURLTypeGUID {
  codespaceURL = "codespace_url",
  vscodeURL = "vscode_url",
}

export enum LabGUIDBash {
  reentrancyFundamentalsAttack = "reentrancy-fundamentals-attack",
  reentrancyFundamentalsDefend = "reentrancy-fundamentals-defend",
}

/*
 * Within the lab, the learner only executes "Vulnerable.sol" or "Attacker.sol" (not "VulnerableSolutionPattern0.sol", etc.)  Thus, we need to normalize output BEFORE surfacing to the learner.  globalTextReplacements is applied to all files that are imported into the UI (lab-core/outputs/, lab-core/contracts), as well as hardhat-tracer output from `cv`
 *
 * IMPORTANT: globalTextReplacements also needs to be inline with regexes within normalize_contract()
 * */
export const globalTextReplacements = [
  {
    matchRegex: "AttackerSolutionPattern[0-9]",
    replaceWithText: "Attacker",
  },
  {
    matchRegex: "VulnerableSolutionPattern[0-9]",
    replaceWithText: "Vulnerable",
  },
];

export const hardhatTracerGlobalTextReplacements = [
  {
    matchRegex: "\\<.*UnknownFunction.*\\>",
    replaceWithText: "receive()",
  },
  ...globalTextReplacements,
];

export enum ChallengeGroupGUID {
  reentrancyFundamentalsAttackPrompt = "reentrancyFundamentalsAttackPrompt",
  reentrancyFundamentalsAttackSolutionPattern0 = "reentrancyFundamentalsAttackSolutionPattern0",
  reentrancyFundamentalsDefendPrompt = "reentrancyFundamentalsDefendPrompt",
  reentrancyFundamentalsDefendSolutionPattern0 = "reentrancyFundamentalsDefendSolutionPattern0",
  reentrancyFundamentalsDefendSolutionPattern1 = "reentrancyFundamentalsDefendSolutionPattern1",
  reentrancyFundamentalsDefendSolutionPattern2 = "reentrancyFundamentalsDefendSolutionPattern2",
  reentrancyFundamentalsDefendSolutionPattern3 = "reentrancyFundamentalsDefendSolutionPattern3",
}

export enum TutorialGUID {
  reentrancyFundamentalsAttackLab = "reentrancyFundamentalsAttackLab",
  reentrancyFundamentalsAttackLabSolution = "reentrancyFundamentalsAttackLabSolution",
  reentrancyFundamentalsAttackTheory = "reentrancyFundamentalsAttackTheory",
  reentrancyFundamentalsDefendLab = "reentrancyFundamentalsDefendLab",
  reentrancyFundamentalsDefendLabSolution = "reentrancyFundamentalsDefendLabSolution",
  reentrancyFundamentalsDefendTheory = "reentrancyFundamentalsDefendTheory",
}

export enum TutorialCommands {
  reentrancyFundamentalsSlither = "slither $BLOCKBASH_WORKSPACE_DIR_PATH/Vulnerable.sol",
}

export enum BlockbashURLs {
  githubIssue = "https://github.com/blockbash/blockbash/issues/new/choose",
  githubProject = "https://github.com/blockbash/blockbash",
  homePage = "https://blockbash.xyz",
}

export enum TutorialName {
  reentrancyFundamentalsAttackLab = "Reentrancy Fundamentals: Attack Lab",
  reentrancyFundamentalsAttackLabSolution = "Reentrancy Fundamentals: Attack Lab (Solution)",
  reentrancyFundamentalsAttackTheory = "Reentrancy Fundamentals: Attack Theory",
  reentrancyFundamentalsDefendLab = "Reentrancy Fundamentals: Defend Lab",
  reentrancyFundamentalsDefendLabSolution = "Reentrancy Fundamentals: Defend Lab (Solution)",
  reentrancyFundamentalsDefendTheory = "Reentrancy Fundamentals: Defend Theory",
}

export enum DiagramConstructNames {
  deductionPhase = "Deduction Phase",
  seedingPhase = "Seeding Phase",
  transferPhase = "Transfer Phase",
}

export enum TutorialTypeGUID {
  attackLab = "attack_lab",
  attackTheory = "attack_theory",
  defendLab = "defend_lab",
  defendTheory = "defend_theory",
}

/* AnchorGUID:
 * - A '#' is prepended via getAnchor
 * - Should correspond to docusaurus MDX headers
 * (e.g., # Hello {#INSERT_ANCHOR_GUID_HERE})
 * */
export enum AnchorGUID {
  contributing = "contributing",
  eventTrace = "eventTrace",
  eventTrace1 = "eventTrace1",
  eventTrace2 = "eventTrace2",
  initExperimentLab = "initExperimentLab",
  labChallenges = "labChallenges",
  labOptions = "labOptions",
  labOptionsCons = "labOptionsCons",
  labOptionsNextSteps = "labOptionsNextSteps",
  labOptionsPrerequisites = "labOptionsPrerequisites",
  labOptionsPros = "labOptionsPros",
  labWorkflow = "labWorkflow",
  maintainers = "maintainers",
  needHelp = "needHelp",
  overview = "overview",
  pattern1Code = "pattern1Code",
  pattern2Code = "pattern2Code",
  pattern3Section = "pattern3Section",
  primaryCode = "primaryCode",
  processDiagram = "processDiagram",
  terminalSolution = "terminalSolution",
  tutorialSearch = "tutorialSearch",
}

// AnchorName: guid to name mapping
export enum AnchorName {
  code = "Code",
  contributing = "Contributing",
  eventTrace = "Event Trace",
  eventTrace1 = "Event Trace 1",
  eventTrace2 = "Event Trace 2",
  initExperimentLab = "Initialize Experiment Lab Environment",
  labChallenges = "Lab Challenges",
  labOptions = "Lab Options",
  labOptionsCons = "Cons",
  labOptionsNextSteps = "Next Steps",
  labOptionsPrerequisites = "Prerequisites",
  labOptionsPros = "Pros",
  labWorkflow = "Lab Workflow",
  maintainers = "Maintainers",
  needHelp = "Need Help",
  overview = "Overview",
  pattern1Code = "Code",
  pattern2Code = "Code",
  pattern3Section = "Pattern 3",
  primaryCode = "Code",
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
