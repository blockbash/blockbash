/*
* In production (and CI) we don't install devDependencies and thereby we
* dont install husky.  We also don't want git hooks running in CI.
* To get around this, we leverage this file to ensure that husky
* isn't activated in CI.
* See https://typicode.github.io/husky/how-to.html#ci-server-and-docker
* */

// Skip Husky install in production and CI
if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
  process.exit(0)
}
const husky = (await import("husky")).default
console.log(husky())