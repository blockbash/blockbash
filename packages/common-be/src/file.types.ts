import type * as fs from "fs";
import type _path from "path";

import { File, FilePath } from "./file";

interface FileDependencies {
  fsLib: typeof fs;
}

interface FilePathDependencies {
  appRootPath: string;
  pathLib: typeof _path;
}

export { File, type FileDependencies, FilePath, type FilePathDependencies };
