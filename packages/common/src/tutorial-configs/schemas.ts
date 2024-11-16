import lowdash from "lodash";
import { z } from "zod";

import {
  AuthorName,
  ChallengeGroupGUID,
  ContractName,
  DeployAccountGUID,
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
  hardhatTracerGlobalTextReplacements,
} from "./constants.external";
import { type TutorialsConfigSchemasDependencies } from "./types";
// All "Schemas" take config inputs from
// constants.fullConfig.ts
class TutorialsConfigSchemas {
  private readonly lowdashLib: TutorialsConfigSchemasDependencies["lowdashLib"];
  private readonly schemaLib: TutorialsConfigSchemasDependencies["schemaLib"];

  constructor({
    dependencies,
  }: {
    dependencies: TutorialsConfigSchemasDependencies;
  }) {
    this.schemaLib = dependencies.schemaLib;
    this.lowdashLib = dependencies.lowdashLib;
  }

  // Taken from
  // https://github.com/colinhacks/zod/discussions/839#discussioncomment-1885806
  static keys<K extends string>(r: Record<K, any>) {
    return Object.keys(r) as K[];
  }

  private get categoriesSchema() {
    return this.schemaLib.array(this.categorySchema).nonempty();
  }

  private get challengeGroupSchema() {
    return this.schemaLib.object({
      guid: this.schemaLib.nativeEnum(ChallengeGroupGUID),
      textReplacements: this.challengeTextReplacementsSchema,
    });
  }

  private get challengeGroupsSchema() {
    return this.schemaLib.array(this.challengeGroupSchema);
  }

  private get challengeTextReplacementSchema() {
    return this.schemaLib.object({
      matchRegex: this.schemaLib.string(),
      replaceWithText: this.schemaLib.string(),
    });
  }

  private get challengeTextReplacementsSchema() {
    return this.schemaLib
      .array(this.challengeTextReplacementSchema)
      .default(hardhatTracerGlobalTextReplacements);
  }

  private get contractSchema() {
    return this.schemaLib.object({
      additionalDeploymentContractName: this.schemaLib
        .nativeEnum(ContractName)
        .optional(),
      // Zod (in this instance) doesn't make the underlying type optional when
      // I specify a .default.  Thus, I set the default value in the
      // TutorialConfig class In other declarations, it appears that .default
      // implies .optional
      deployAccountGUID: this.schemaLib
        .nativeEnum(DeployAccountGUID)
        .default(DeployAccountGUID.default),
      ethAmount: this.schemaLib.number().default(1),
      name: this.schemaLib.nativeEnum(ContractName),
      proxy: this.schemaLib.boolean().default(false),
    });
  }

  // TODO-P4: Each tutorial should have a tutorial-type of 'theory' or 'lab'.
  // If 'lab', this field should be mandatory
  private get contractsSchema() {
    return this.schemaLib.array(this.contractSchema);
  }

  private get playlistSchema() {
    return this.schemaLib.object({
      guid: this.schemaLib.nativeEnum(PlaylistGUID),
      name: this.schemaLib.nativeEnum(PlaylistName),
      url: this.schemaLib.nativeEnum(PlaylistURLPath),
    });
  }

  private get tutorialSchema() {
    return this.schemaLib
      .object({
        authorName: this.schemaLib.nativeEnum(AuthorName),
        categories: this.categoriesSchema,
        challengeTextReplacements: this.challengeTextReplacementsSchema,
        description: this.schemaLib.string(),
        difficultyName: this.schemaLib.nativeEnum(TutorialDifficultyName),
        durationMinutes: this.schemaLib.number(),
        guid: this.schemaLib.nativeEnum(TutorialGUID),
        lab: this.labSchema.optional(),
        name: this.schemaLib.nativeEnum(TutorialName),
        playlist: this.playlistSchema,
        publishedDate: this.schemaLib.date(),
        type: this.typeSchema,
        url: this.schemaLib.string(),
      })
      .transform((o) => ({
        guidKabob: String(this.lowdashLib.kebabCase(o.guid)),
        ...o,
      }));
  }

  private get typeSchema() {
    return this.schemaLib.object({
      guid: this.schemaLib.nativeEnum(TutorialTypeGUID),
      name: this.schemaLib.nativeEnum(TutorialTypeName),
    });
  }

  get categoriesGUIDValue() {
    return this.categorySchema.keyof().Enum.guid;
  }

  get categorySchema() {
    return this.schemaLib.object({
      guid: this.schemaLib.nativeEnum(TutorialCategoryGUID),
      name: this.schemaLib.nativeEnum(TutorialCategoryName),
    });
  }

  get contentTypeGUIDValue() {
    return this.typeSchema.keyof().Enum.guid;
  }

  public get labSchema() {
    return this.schemaLib.object({
      challengeGroups: this.challengeGroupsSchema,
      codespaceURL: this.schemaLib.string(),
      contracts: this.contractsSchema,
      vscodeURL: this.schemaLib.string(),
    });
  }

  get playlistGUIDValue() {
    return this.playlistSchema.keyof().Enum.guid;
  }

  get tutorialsSchema() {
    return this.schemaLib.array(this.tutorialSchema).nonempty();
  }
}

const schema = new TutorialsConfigSchemas({
  dependencies: {
    lowdashLib: lowdash,
    schemaLib: z,
  },
});
export { TutorialsConfigSchemas, schema };
