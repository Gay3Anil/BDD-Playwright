import { testConfig } from "../config/config";

export const Config = {
  baseUrl: testConfig.baseUrl,
  username: testConfig.username,
  password: testConfig.password
} as const;