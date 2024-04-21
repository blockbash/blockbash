import { type ChallengeURLTypeGUID } from "./constants.fullConfig"
import {
  type Contract,
  type ContractNames,
  type Contracts,
  type CreateTutorialConfigDependencies,
  type GetContract,
  type Schema,
  type Tutorial,
  type TutorialCategoriesWithCount,
  type TutorialGUID,
  type TutorialLearningPathsWithCount,
  type TutorialTypesWithCount,
  type Tutorials,
  type TutorialsConfig,
  type TutorialsConfigDependencies,
} from "./types"

export class TutorialsConfigOrchestrator {
  private readonly contracts: Contracts

  private readonly ethLib: TutorialsConfigDependencies["ethLib"]

  private readonly logger: TutorialsConfigDependencies["logger"]

  private readonly lowdashLib: TutorialsConfigDependencies["lowdashLib"]

  private readonly schema: Schema

  private readonly tutorials: Tutorials

  constructor({
    injectedDependencies,
    schema,
    tutorialsConfig,
  }: {
    injectedDependencies: TutorialsConfigDependencies;
    schema: Schema;
    tutorialsConfig: TutorialsConfig;
  })
  {
    this.logger = injectedDependencies.logger.setGlobalContext({
      className: TutorialsConfigOrchestrator.name,
      logicPath: __filename,
    })
    this.ethLib = injectedDependencies.ethLib
    this.lowdashLib = injectedDependencies.lowdashLib
    this.schema = schema
    this.tutorials = this.schema.tutorialsSchema.parse(tutorialsConfig)
    this.contracts = this.flattenContracts({tutorials: this.tutorials})
  }

  static getContractNames({contract}: {
    contract: Contract
  })
  {
    const names: ContractNames = [contract.name]
    if (contract.additionalDeploymentContractName !== undefined) {
      names.push(contract.additionalDeploymentContractName)
    }
    return names
  }

  // noinspection FunctionWithMultipleLoopsJS
  flattenContracts({tutorials}: {
    tutorials: Tutorials
  })
  {
    const contracts: Contracts = []
    tutorials.forEach((tutorial) => {
      const {lab} = tutorial
      if (lab) {
        lab.contracts.forEach((contract) => {
          contracts.push({
            tutorialGUID: tutorial.guid,
            weiAmount: this.ethLib.ethToWei({eth: contract.ethAmount}),
            ...contract,
          })
        })
      }
    })
    return contracts
  }

  getActiveContentCategories(): TutorialCategoriesWithCount {
    const categories = this.tutorials.map((tutorial) => tutorial.categories)
    return this.getUniqueDictCount(
      categories.flat(),
      this.schema.categoriesGUIDValue,
    )
  }

  getActiveContentTypes(): TutorialTypesWithCount {
    const contentTypes = this.tutorials.map((tutorial) => tutorial.type)
    const activeContent = this.getUniqueDictCount(
      contentTypes,
      this.schema.contentTypeGUIDValue,
    )
    this.logger.logInnerFinishedExecution({
      functionName: this.getActiveContentTypes.name,
      metadata: activeContent,
    })
    return activeContent
  }

  getActiveLearningPaths(): TutorialLearningPathsWithCount {
    const paths = this.tutorials.map((tutorial) => tutorial.learningPath)
    const activeContent = this.getUniqueDictCount(
      paths.flat(),
      this.schema.learningPathGUIDValue,
    )
    this.logger.logInnerFinishedExecution({
      functionName: this.getActiveLearningPaths.name,
      metadata: activeContent,
    })

    return activeContent
  }

  // getTutorialCategoryName(GUID: CategoryGUID) {
  //   const category = this.getTutorialCategories().find(
  //     (_category) => _category.guid === GUID
  //   )
  //
  //   if (category === undefined) {
  //     throw new Error(`No category name found for GUID: ${GUID}`)
  //   }
  //   return category.name
  // }

  getChallengeTextReplacements({
    tutorialGUID,
  }: {
    tutorialGUID: TutorialGUID;
  })
  {
    return this.getTutorial(tutorialGUID).challengeTextReplacements
  }

  getContract({contractName, tutorialGUID}: GetContract) {
    const contracts = this.getTutorialContracts({guid: tutorialGUID}).filter(
      ({name}) => name === contractName,
    )
    const loggerArgs = {
      functionName: this.getContract.name,
      metadata: {
        contractName,
        tutorialGUID,
      },
    }
    if (contracts.length === 0 || contracts[0] === undefined) {
      const message = "No contract found"
      this.logger.error({...loggerArgs, message})
      throw new Error(message)
    } else if (contracts.length > 1) {
      const message = "Multiple contracts found"
      this.logger.error({...loggerArgs, message})
      throw new Error(message)
    }
    return contracts[0]
  }

  getContractsByTutorial() {
    // noinspection TypeScriptMissingAugmentationImport
    return this.lowdashLib.groupBy(
      this.contracts,
      (contract) => contract.tutorialGUID,
    ) as Record<TutorialGUID, Contracts>
  }

  getTutorial(tutorialGUID: TutorialGUID): Tutorial {
    const tutorials = this.tutorials.filter(
      (tutorial) => tutorial.guid === tutorialGUID,
    )
    if (tutorials.length !== 1) {
      this.logger.warn({
        functionName: this.getTutorial.name,
        message: "Abnormal number of tutorials found",
        metadata: {tutorials},
      })
    }
    if (typeof tutorials[0] === "undefined") {
      throw new Error("Tutorial wasn't defined")
    }
    return tutorials[0]
  }

  getTutorialCategoryGUIDs(tutorialGUID: TutorialGUID) {
    return this.getTutorial(tutorialGUID).categories.map(
      (category) => category.guid,
    )
  }

  getTutorialContracts({guid}: {
    guid: TutorialGUID
  })
  {
    const contracts = this.contracts.filter(
      ({tutorialGUID}) => guid === tutorialGUID,
    )
    if (contracts.length === 0) {
      const msg = "No contracts found"
      this.logger.error({
        functionName: this.getTutorialContracts.name,
        message: msg,
        metadata: {
          guid,
        },
      })
      throw new Error(msg)
    }
    return contracts
  }

  getTutorialTypeGUID(tutorialGUID: TutorialGUID) {
    return this.getTutorial(tutorialGUID).type.guid
  }

  getTutorials() {
    // noinspection TypeScriptMissingAugmentationImport
    return this.tutorials
  }

  getUniqueDictCount<Type extends Record<any, any>, Key extends keyof Type>(
    objects: Type[],
    guid: Key,
  )
  {
    const counts = this.lowdashLib.countBy(objects, guid) as Record<
      Key,
      number
    >

    return this.lowdashLib.uniqBy(objects, guid).map((obj) => {
      const lookup = obj[guid]
      return {
        count: counts[lookup] as number,
        ...obj,
      }
    })
  }

  get tutorialGUIDs() {
    return this.tutorials.map((tutorial) => tutorial.guid)
  }
}

export function getChallengeURL({
  buildChallenges,
  challengeGUIDTypescript,
  challengeURLTypeGUID,
}: {
  buildChallenges: CreateTutorialConfigDependencies["buildChallenges"];
  challengeGUIDTypescript: string;
  challengeURLTypeGUID: ChallengeURLTypeGUID;
}): string {
  const challenges = buildChallenges.filter(
    (challenge) =>
      challenge.challenge_guid_typescript === challengeGUIDTypescript,
  )
  if (challenges.length !== 1) {
    throw new Error("Too many challenges")
  }
  const tutorialUrl = challenges[0]?.[challengeURLTypeGUID]

  if (typeof tutorialUrl === "undefined") {
    throw new Error("Wrong challenge type")
  }
  return tutorialUrl
}
