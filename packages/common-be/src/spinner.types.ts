import type chalk from "chalk";
import type * as console from "console";
import type ora from "ora";

import type { loggerTypes } from ".";

import { Spinner } from "./spinner";

interface SpinnerDependencies {
  colorLib: typeof chalk;
  consoleLib: typeof console;
  logger: loggerTypes.ILogger;
  spinnerLib: typeof ora;
}

export { Spinner, type SpinnerDependencies };
