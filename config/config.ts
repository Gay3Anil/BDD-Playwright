import dotenv from "dotenv";
import { userInfo } from "node:os";
import { resolve } from "node:path";

export type BrowserName = "chromium" | "firefox" | "webkit";

const environment = process.env.TEST_ENV ?? "qa";

if (environment !== "qa" && environment !== "uat") {
  throw new Error(`Unsupported TEST_ENV "${environment}". Use "qa" or "uat".`);
}

const envFilePath = resolve(__dirname, `.env.${environment}`);
const envFile = dotenv.config({ path: envFilePath });

if (envFile.error) {
  throw new Error(`Unable to load environment file ${envFilePath}: ${envFile.error.message}`);
}

function requiredEnvironmentValue(name: string): string {
  const processValue = process.env[name];
  const windowsUserNameCollision =
    name === "USERNAME" &&
    processValue?.toLowerCase() === userInfo().username.toLowerCase();
  // Windows sets USERNAME to the OS account, which should not override the selected test account.
  const value = windowsUserNameCollision ? envFile.parsed?.[name] : processValue ?? envFile.parsed?.[name];
  if (!value) {
    throw new Error(`Missing ${name} in ${envFilePath} or the process environment.`);
  }
  return value;
}

const browserValue = process.env.BROWSER ?? "chromium";
if (!["chromium", "firefox", "webkit"].includes(browserValue)) {
  throw new Error(`Unsupported BROWSER "${browserValue}". Use chromium, firefox, or webkit.`);
}

const timeout = Number(process.env.TIMEOUT_MS ?? "10000");
if (!Number.isFinite(timeout) || timeout <= 0) {
  throw new Error("TIMEOUT_MS must be a positive number.");
}

export const testConfig = {
  environment,
  baseUrl: requiredEnvironmentValue("BASE_URL"),
  username: requiredEnvironmentValue("USERNAME"),
  password: requiredEnvironmentValue("PASSWORD"),
  browser: browserValue as BrowserName,
  headless: process.env.HEADLESS?.toLowerCase() !== "false",
  timeout
} as const;