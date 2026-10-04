import { testConfig } from "./config/config";

// These are Playwright library settings consumed by the Cucumber hooks; this is not a Playwright Test config.
const playwrightConfig = {
  baseURL: testConfig.baseUrl,
  browser: testConfig.browser,
  headless: testConfig.headless,
  timeout: testConfig.timeout
} as const;

export default playwrightConfig;