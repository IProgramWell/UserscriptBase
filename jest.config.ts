const IGNORE: string[] = [
	"<rootDir>/node_modules/",
	"<rootDir>/dist/",
];

export default {
	preset: "ts-jest",
	transform: {
		"\\.ts": [
			"ts-jest",
			{ tsconfig: "./tests/tsconfig.json" }
		]
	},
	setupFilesAfterEnv: ["jest-extended/all"],
	testEnvironment: "jsdom",
	testPathIgnorePatterns: IGNORE,
	transformIgnorePatterns: IGNORE,
	watchPathIgnorePatterns: IGNORE,
	modulePathIgnorePatterns: IGNORE,
	coveragePathIgnorePatterns: IGNORE,
} as import("jest").Config;