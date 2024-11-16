import { type ChallengeGroupGUID, LabURLTypeGUID } from "./constants.external";
import {
  type Contract,
  type ContractNames,
  type Contracts,
  type CreateTutorialConfigDependencies,
  type GetContract,
  type LabGUIDBash,
  type PlaylistGUID,
  type Schema,
  type Tutorial,
  type TutorialCategoriesWithCount,
  type TutorialGUID,
  type TutorialPlaylistWithCount,
  type TutorialPlaylistsWithCount,
  type TutorialTypesWithCount,
  type Tutorials,
  type TutorialsConfig,
  type TutorialsConfigDependencies,
} from "./types";

export class TutorialsConfigOrchestrator {
  private readonly contracts: Contracts;

  private readonly ethLib: TutorialsConfigDependencies["ethLib"];

  private readonly logger: TutorialsConfigDependencies["logger"];

  private readonly lowdashLib: TutorialsConfigDependencies["lowdashLib"];

  private readonly schema: Schema;

  private readonly tutorials: Tutorials;

  constructor({
    injectedDependencies,
    schema,
    tutorialsConfig,
  }: {
    injectedDependencies: TutorialsConfigDependencies;
    schema: Schema;
    tutorialsConfig: TutorialsConfig;
  }) {
    this.logger = injectedDependencies.logger.setGlobalContext({
      className: TutorialsConfigOrchestrator.name,
      logicPath: __filename,
    });
    this.ethLib = injectedDependencies.ethLib;
    this.lowdashLib = injectedDependencies.lowdashLib;
    this.schema = schema;
    this.tutorials = this.schema.tutorialsSchema.parse(tutorialsConfig);
    this.contracts = this.flattenContracts({ tutorials: this.tutorials });
  }

  static getContractNames({ contract }: { contract: Contract }) {
    const names: ContractNames = [contract.name];
    if (contract.additionalDeploymentContractName !== undefined) {
      names.push(contract.additionalDeploymentContractName);
    }
    return names;
  }

  // noinspection FunctionWithMultipleLoopsJS
  flattenContracts({ tutorials }: { tutorials: Tutorials }) {
    const contracts: Contracts = [];
    tutorials.forEach((tutorial) => {
      const { lab } = tutorial;
      if (lab) {
        lab.contracts.forEach((contract) => {
          contracts.push({
            tutorialGUID: tutorial.guid,
            weiAmount: this.ethLib.ethToWei({ eth: contract.ethAmount }),
            ...contract,
          });
        });
      }
    });
    return contracts;
  }

  getActiveContentCategories(): TutorialCategoriesWithCount {
    const categories = this.tutorials.map((tutorial) => tutorial.categories);
    return this.getUniqueDictCount(
      categories.flat(),
      this.schema.categoriesGUIDValue,
    );
  }

  getActiveContentTypes(): TutorialTypesWithCount {
    const contentTypes = this.tutorials.map((tutorial) => tutorial.type);
    const activeContent = this.getUniqueDictCount(
      contentTypes,
      this.schema.contentTypeGUIDValue,
    );
    this.logger.logInnerFinishedExecution({
      functionName: this.getActiveContentTypes.name,
      metadata: activeContent,
    });
    return activeContent;
  }

  getActivePlaylist(path: PlaylistGUID): TutorialPlaylistWithCount | undefined {
    const paths = this.getActivePlaylists();
    const filteredPaths = paths.filter((_path) => path === _path.guid);
    return filteredPaths[0];
  }

  getActivePlaylists(): TutorialPlaylistsWithCount {
    const paths = this.tutorials.map((tutorial) => tutorial.playlist);
    const activeContent = this.getUniqueDictCount(
      paths.flat(),
      this.schema.playlistGUIDValue,
    );
    this.logger.logInnerFinishedExecution({
      functionName: this.getActivePlaylists.name,
      metadata: activeContent,
    });

    return activeContent;
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

  getChallengeGroup(challengeGroupGUID: ChallengeGroupGUID) {
    const challengeGroups = this.challengeGroups.filter(
      (challengeGroup) => challengeGroup.guid === challengeGroupGUID,
    );
    const loggerArgs = {
      functionName: this.getChallengeGroup.name,
      metadata: {
        challengeGroupGUID,
        challengeGroups,
      },
    };
    if (challengeGroups.length === 0 || challengeGroups[0] === undefined) {
      const message = "No challenge group was found";
      this.logger.error({ ...loggerArgs, message });
      throw new Error(message);
    } else if (challengeGroups.length > 1) {
      const message = `${challengeGroups.length} challenges groups found!  There should only be 1.`;
      this.logger.error({ ...loggerArgs, message });
      throw new Error(message);
    }
    return challengeGroups[0];
  }

  getContract({ contractName, tutorialGUID }: GetContract) {
    const contracts = this.getTutorialContracts({ guid: tutorialGUID }).filter(
      ({ name }) => name === contractName,
    );
    const loggerArgs = {
      functionName: this.getContract.name,
      metadata: {
        contractName,
        tutorialGUID,
      },
    };
    if (contracts.length === 0 || contracts[0] === undefined) {
      const message = "No contract found";
      this.logger.error({ ...loggerArgs, message });
      throw new Error(message);
    } else if (contracts.length > 1) {
      const message = "Multiple contracts found";
      this.logger.error({ ...loggerArgs, message });
      throw new Error(message);
    }
    return contracts[0];
  }

  getContractsByTutorial(): Record<TutorialGUID, Contracts> {
    // noinspection TypeScriptMissingAugmentationImport
    return this.lowdashLib.groupBy(
      this.contracts,
      (contract) => contract.tutorialGUID,
    ) as Record<TutorialGUID, Contracts>;
  }

  getTutorial(tutorialGUID: TutorialGUID): Tutorial {
    const tutorials = this.tutorials.filter(
      (tutorial) => tutorial.guid === tutorialGUID,
    );
    if (tutorials.length !== 1) {
      this.logger.warn({
        functionName: this.getTutorial.name,
        message: "Abnormal number of tutorials found",
        metadata: { tutorials },
      });
    }
    if (typeof tutorials[0] === "undefined") {
      throw new Error("Tutorial wasn't defined");
    }
    return tutorials[0];
  }

  getTutorialCategoryGUIDs(tutorialGUID: TutorialGUID) {
    return this.getTutorial(tutorialGUID).categories.map(
      (category) => category.guid,
    );
  }

  getTutorialContracts({ guid }: { guid: TutorialGUID }) {
    const contracts = this.contracts.filter(
      ({ tutorialGUID }) => guid === tutorialGUID,
    );
    if (contracts.length === 0) {
      const msg = "No contracts found";
      this.logger.error({
        functionName: this.getTutorialContracts.name,
        message: msg,
        metadata: {
          guid,
        },
      });
      throw new Error(msg);
    }
    return contracts;
  }

  getTutorialTypeGUID(tutorialGUID: TutorialGUID) {
    return this.getTutorial(tutorialGUID).type.guid;
  }

  getTutorials() {
    // noinspection TypeScriptMissingAugmentationImport
    return this.tutorials;
  }

  getUniqueDictCount<Type extends Record<any, any>, Key extends keyof Type>(
    objects: Type[],
    guid: Key,
  ) {
    const counts = this.lowdashLib.countBy(objects, guid) as Record<
      Key,
      number
    >;

    return this.lowdashLib.uniqBy(objects, guid).map((obj) => {
      const lookup = obj[guid];
      return {
        count: counts[lookup] as number,
        ...obj,
      };
    });
  }

  get challengeGroupGUIDs() {
    return this.challengeGroups.map((challengeGroup) => {
      return challengeGroup.guid;
    });
  }

  get challengeGroups() {
    return this.tutorials
      .map((tutorial) => {
        if (typeof tutorial.lab === "undefined") {
          return [];
        } else {
          return tutorial.lab.challengeGroups;
        }
      })
      .flat();
  }

  get tutorialGUIDs() {
    return this.tutorials.map((tutorial) => tutorial.guid);
  }
}

export function getVSCodeLabURL({
  buildLabsConfig,
  labGUIDBash,
}: {
  buildLabsConfig: CreateTutorialConfigDependencies["buildLabsConfig"];
  labGUIDBash: LabGUIDBash;
}): string {
  return getLabURL({
    buildLabsConfig,
    labGUIDBash,
    labURLType: LabURLTypeGUID.vscodeURL,
  });
}

export function getCodespaceLabURL({
  buildLabsConfig,
  labGUIDBash,
}: {
  buildLabsConfig: CreateTutorialConfigDependencies["buildLabsConfig"];
  labGUIDBash: LabGUIDBash;
}): string {
  return getLabURL({
    buildLabsConfig,
    labGUIDBash,
    labURLType: LabURLTypeGUID.codespaceURL,
  });
}

function getLabURL({
  buildLabsConfig,
  labGUIDBash,
  labURLType,
}: {
  buildLabsConfig: CreateTutorialConfigDependencies["buildLabsConfig"];
  labGUIDBash: LabGUIDBash;
  labURLType: LabURLTypeGUID;
}): string {
  const labs = buildLabsConfig.filter(
    (lab) => lab.lab_guid_bash === labGUIDBash,
  );
  if (labs.length > 1) {
    throw new Error(
      `labGUIDBash '${labGUIDBash}' matched too many labs.  Matched labs == ${labs.length}`,
    );
  } else if (labs.length === 0) {
    throw new Error(`labGUIDBash '${labGUIDBash}' didn't match any labs.`);
  }
  const labURL = labs[0]?.[labURLType];

  if (typeof labURL === "undefined") {
    throw new Error("Wrong lab type");
  }
  return labURL;
}
