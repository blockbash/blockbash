import type lodash from "lodash";

// @ts-expect-error: TODO: Fix BigNumber
import { type BigNumber } from "ethers";
import { type z } from "zod";

import type buildLabsConfig from "../../../../apps/build/artifacts/labs/merged-metadata.json";

import { type Eth } from "../eth";
import { type ILoggerMin } from "../logger.types";
import {
  TutorialsConfigOrchestrator,
  type getCodespaceLabURL,
  type getVSCodeLabURL,
} from "./configs";
import {
  type AnchorGUID,
  type AnchorName,
  type ChallengeDescriptions,
  type ChallengeGroupGUID,
  type LabGUIDBash,
  type LabURLTypeGUID,
  type PlaylistGUID,
} from "./constants.external";
import { TutorialsConfigSchemas, type schema } from "./schemas";

interface TutorialsConfigDependencies {
  ethLib: Eth;
  logger: ILoggerMin;
  lowdashLib: typeof lodash;
}
interface TutorialsConfigSchemasDependencies {
  lowdashLib: typeof lodash;
  schemaLib: typeof z;
}

type Schema = typeof schema;
type TutorialsSchema = typeof schema.tutorialsSchema;
// We use z.inputs because TutorialsConfig type refers to the data that is passed INTO the schema parsing function.
// z.infer refers to the type that is generated after the schema is parsed
type TutorialsConfig = z.input<TutorialsSchema>;

interface CreateTutorialConfigDependencies {
  buildLabsConfig: typeof buildLabsConfig;
  getCodespaceLabURL: typeof getCodespaceLabURL;
  getVSCodeLabURL: typeof getVSCodeLabURL;
}

// Tutorial
type Tutorials = z.infer<TutorialsSchema>;
type Tutorial = Tutorials["0"];
type TutorialGUID = Tutorial["guid"];
type TutorialGUIDKabob = Tutorial["guidKabob"];
type TutorialGUIDs = TutorialGUID[];

// Tutorial Learning Path
type TutorialPlaylist = Tutorial["playlist"];
interface TutorialPlaylistWithCount extends TutorialPlaylist {
  count: number;
}
type TutorialPlaylistsWithCount = TutorialPlaylistWithCount[];
type TutorialPlaylistName = TutorialPlaylist["name"];

// Tutorial Categories
type TutorialCategories = Tutorial["categories"];
type TutorialCategory = TutorialCategories["0"];
type TutorialCategoryGUID = TutorialCategory["guid"];
type TutorialCategoryGUIDs = TutorialCategoryGUID[];
interface TutorialCategoryWithCount extends TutorialCategory {
  count: number;
}
type TutorialCategoriesWithCount = TutorialCategoryWithCount[];

// Tutorial Type
type TutorialType = Tutorial["type"];
type TutorialTypeGUID = TutorialType["guid"];
type TutorialTypeGUIDs = TutorialTypeGUID[];
interface TutorialTypeWithCount extends TutorialType {
  count: number;
}
type TutorialTypesWithCount = TutorialTypeWithCount[];

// Tutorial Lab Configs
type TutorialLab = z.infer<typeof schema.labSchema>;

// The Contract(s) type (that we expose to other services) will be Contract/Contracts type
// Thus, we add _ to signify this type will not be exported
// eslint-disable-next-line @typescript-eslint/naming-convention
type _Contracts = TutorialLab["contracts"];
// eslint-disable-next-line @typescript-eslint/naming-convention
type _Contract = _Contracts[0];
interface Contract extends _Contract {
  tutorialGUID: TutorialGUID;
  weiAmount: BigNumber;
}
type ContractName = Contract["name"];
type ContractNames = ContractName[];
type Contracts = Contract[];
type ContractDeployAccountGUID = Contract["deployAccountGUID"];

type ChallengeTextReplacements = Tutorial["challengeTextReplacements"];

type TutorialDifficultyName = Tutorial["difficultyName"];
type TutorialDifficultyNames = TutorialDifficultyName[];

// Are "selectable" within the UI
type TutorialSelectableFiltersWithCount =
  | TutorialCategoriesWithCount
  | TutorialTypesWithCount;
type TutorialSelectableFilterGUID = TutorialCategoryGUID | TutorialTypeGUID;
type TutorialSelectableFilterGUIDs = TutorialSelectableFilterGUID[];

interface GetContract {
  contractName: ContractName;
  tutorialGUID: TutorialGUID;
}

// Challenges
type ChallengeGroup = TutorialLab["challengeGroups"][0];
type ChallengeGroupGUIDs = ChallengeGroupGUID[];

export {
  type AnchorGUID,
  type AnchorName,
  type ChallengeDescriptions,
  type ChallengeGroup,
  type ChallengeGroupGUID,
  type ChallengeGroupGUIDs,
  type ChallengeTextReplacements,
  type Contract,
  type ContractDeployAccountGUID,
  type ContractName,
  type ContractNames,
  type Contracts,
  type CreateTutorialConfigDependencies,
  type GetContract,
  type LabGUIDBash,
  type LabURLTypeGUID,
  type PlaylistGUID,
  type Schema,
  type Tutorial,
  type TutorialCategories,
  type TutorialCategoriesWithCount,
  type TutorialCategory,
  type TutorialCategoryGUID,
  type TutorialCategoryGUIDs,
  type TutorialDifficultyName,
  type TutorialDifficultyNames,
  type TutorialGUID,
  type TutorialGUIDKabob,
  type TutorialGUIDs,
  type TutorialPlaylistName,
  type TutorialPlaylistWithCount,
  type TutorialPlaylistsWithCount,
  type TutorialSelectableFilterGUID,
  type TutorialSelectableFilterGUIDs,
  type TutorialSelectableFiltersWithCount,
  type TutorialTypeGUID,
  type TutorialTypeGUIDs,
  type TutorialTypeWithCount,
  type TutorialTypesWithCount,
  type Tutorials,
  type TutorialsConfig,
  type TutorialsConfigDependencies,
  TutorialsConfigOrchestrator,
  TutorialsConfigSchemas,
  type TutorialsConfigSchemasDependencies,
  type TutorialsSchema,
  type buildLabsConfig,
};
