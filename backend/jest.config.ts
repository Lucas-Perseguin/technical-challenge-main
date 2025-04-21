import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "node",
	extensionsToTreatAsEsm: [".ts"],
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				useESM: true,
			},
		],
	},
	setupFiles: ["dotenv/config"],
	testMatch: ["**/*.test.ts"],
	verbose: true,
	forceExit: true,
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
};

export default config;
