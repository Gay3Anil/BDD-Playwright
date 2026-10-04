import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

// Cucumber CLI owns scenario execution; this wrapper forwards feature paths and options such as --tags.
async function run(): Promise<void> {
  const projectRoot = process.cwd();
  const cucumberCliPath = resolve(
    projectRoot,
    "node_modules",
    "@cucumber",
    "cucumber",
    "bin",
    "cucumber.js"
  );

  if (!existsSync(cucumberCliPath)) {
    throw new Error("Cucumber CLI was not found. Run npm install before starting the test runner.");
  }

  // The HTML formatter needs its output directory to exist before Cucumber starts.
  await mkdir(resolve(projectRoot, "reports"), { recursive: true });

  const cucumberProcess = spawn(process.execPath, [cucumberCliPath, ...process.argv.slice(2)], {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit"
  });

  cucumberProcess.once("error", (error) => {
    console.error(`Unable to start Cucumber: ${error.message}`);
    process.exitCode = 1;
  });

  cucumberProcess.once("exit", (code, signal) => {
    if (signal) {
      console.error(`Cucumber stopped after receiving ${signal}.`);
      process.exitCode = 1;
      return;
    }
    process.exitCode = code ?? 1;
  });
}

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});