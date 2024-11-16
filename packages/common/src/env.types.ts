import { Env } from "./env";

interface EnvDependencies {
  envVars: typeof process.env;
}

export { Env, type EnvDependencies };
