// As this module is loaded relatively early in the initialization cycle

// TODO: Load filesystem.env
// If blockbash is running in a container, have logs go to
// $container_logs_dir_path

// we keep injectedDependencies to a minimum (e.g., no logger, etc.)
// eslint-disable-next-line max-classes-per-file
import type { FileDependencies, FilePathDependencies } from "./file.types"

// For File Operations
export class File {
  private readonly fsLib: FileDependencies["fsLib"]

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: FileDependencies;
  })
  {
    this.fsLib = injectedDependencies.fsLib
  }

  parseJSON({path}: {
    path: string
  })
  {
    return JSON.parse(this.fsLib.readFileSync(path, "utf-8"))
  }
}

export class FilePath {
  private readonly appRootPath: FilePathDependencies["appRootPath"]

  private readonly pathLib: FilePathDependencies["pathLib"]

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: FilePathDependencies;
  })
  {
    this.pathLib = injectedDependencies.pathLib
    this.appRootPath = injectedDependencies.appRootPath
  }

  get challengeResultsFilePath(): string {
    return this.pathLib.resolve(
      this.challengeResultsDirPath,
      `challengeResults.json`,
    )
  }

  get challengeResultsDirPath(): string {
    return this.pathLib.resolve(this.labCoreArtifactsDirPath,
      "challenge-results")
  }

  get challengesDirPath(): string {
    return this.pathLib.resolve(this.labCoreDirPath, "challenges")
  }

  get labCoreArtifactsHardhatArtifactsDirPath(): string {
    return this.pathLib.resolve(this.labCoreArtifactsDirPath,
      "hardhat-artifacts")
  }

  get labCoreArtifactsHardhatCacheDirPath(): string {
    return this.pathLib.resolve(this.labCoreArtifactsDirPath,
      "hardhat-cache")
  }

  get labCoreArtifactsTypesDirPath(): string {
    return this.pathLib.resolve(this.labCoreArtifactsDirPath,
      "types")
  }

  get labCoreArtifactsTypechainDirPath(): string {
    return this.pathLib.resolve(this.labCoreArtifactsTypesDirPath,
      "typechain")
  }

  get labCoreDirPath(): string {
    return this.pathLib.resolve(this.rootDirPath, "apps/lab-core")
  }

  get labCoreArtifactsDirPath(): string {
    return this.pathLib.resolve(this.labCoreDirPath, "artifacts")
  }

  get debugLogFilePath(): string {
    return this.pathLib.resolve(this.logsDirPath, "node.log")
  }

  get devContainerDirPath(): string {
    return this.pathLib.resolve(this.rootDirPath, "apps/build/devcontainer")
  }

  get devcontainerEnvironmentsDirPath(): string {
    return this.pathLib.resolve(this.devContainerDirPath, "environments")
  }

  get logsDirPath(): string {
    return this.pathLib.resolve(this.rootDirPath, "logs")
  }

  get rootDirPath(): string {
    return this.appRootPath
  }
}
