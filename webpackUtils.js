const Path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

/**
 * @typedef {import("./types/ViolentMonkey").Metadata} Metadata
 * @typedef {import("webpack").Configuration} Configuration
 */

/**
 * @type {{
 * 	[key in keyof Metadata]?: (value: Metadata[key], keySuffix?: string) => string;
 * }}
 */
const TAG_TO_STRING = {
	match: (matchArray, keySuffix) => matchArray
		.map(match => `// @match${keySuffix ?? ""} ${match.toString()}`)
		.join("\n"),
	"exclude-match": (matchArray, keySuffix) => matchArray
		.map(match => `// @exclude-match${keySuffix ?? ""} ${match.toString()}`)
		.join("\n"),
	require: (reqArray, keySuffix) => reqArray
		.map(req => `// @require${keySuffix ?? ""} ${req.toString()}`)
		.join("\n"),
	resource: (resourceArray, keySuffix) => resourceArray
		.map(resource => `// @resource${keySuffix ?? ""} ${resource.name} ${resource.url.toString()}`)
		.join("\n"),
	noframes: (noframes, keySuffix) => noframes
		? `// @noframes${keySuffix ?? ""}`
		: "",
	grant: (grant, keySuffix) => grant === "none"
		? "// @grant none"
		: (Array.isArray(grant)
			? grant
				.map(grant => `// @grant${keySuffix ?? ""} ${grant}`)
				.join("\n")
			: `// @grant ${grant}`
		),
	unwrap: (unwrap, keySuffix) => unwrap
		? `// @unwrap${keySuffix ?? ""}`
		: "",
	// Don't need a special function if all it does is echo the provided key/val pair.
	// name: name => `// @name ${name}`,
	// namespace: namespace => `// @namespace ${namespace}`,
	// version: ver => `// @version ${ver}`,
	// description: desc => `// @description ${desc}`,
	// icon: icon => `// @icon ${icon.toString()}`,
	// "run-at": runAt => `// @run-at ${runAt}`,
	// "inject-into": inject => `// @inject-into ${inject}`,
	// downloadURL: dlUrl => `// @downloadURL ${dlUrl.toString()}`,
	// supportURL: supUrl => `// @supportURL ${supUrl.toString()}`,
	// homepageURL: hpUrl => `// @homepageURL ${hpUrl.toString()}`,
};

/**
* 
* @param {Metadata} metadata 
* @param {boolean} [spaceEvently] 
* @returns {string}
*/
function generateMetadataBlock(metadata, spaceEvently = true)
{
	/** @type {string[]} */
	const MetadataSegments = [];

	/** @type {string} */
	let currentValue,
		/** @type {string} */
		keySuffix,
		/** @type {number} */
		maxKeyLength = 0;

	for (let key in metadata)
		if (key.length > maxKeyLength)
			maxKeyLength = key.length;

	for (let key in metadata)
	{
		keySuffix = spaceEvently
			? " ".repeat(maxKeyLength - key.length)
			: "";

		currentValue = (
			TAG_TO_STRING[key]?.(
				metadata[key],
				keySuffix
			) ??
			`// @${key}${keySuffix} ${metadata[key]}`
		)
			.trim();

		if (currentValue)
			MetadataSegments.push(currentValue);
	}

	return `// ==UserScript==
${MetadataSegments.join("\n")}
// ==/UserScript==`;
}


/**
 * 
 * @param {Metadata} metadata
 * @param {string} buildPath
 * @param {Configuration["mode"]} mode 
 * @param {string} entry 
 * @returns {Configuration}
 */
function getWebpackConfig(metadata, buildPath, mode = "production", entry = "./src/index.ts")
{
	return {
		entry,
		mode,
		resolve: { extensions: [".ts", ".js"], },
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: "ts-loader",
					exclude: /node_modules/
				}
			]
		},
		output: {
			path: buildPath,
			filename: `${metadata.name.replace(/\W/g, "")}.user.js`
		},
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						format: { preamble: generateMetadataBlock(metadata, true), },
						mangle: mode === "production" && { properties: { keep_quoted: true, }, },
					},
				})
			]
		},
	}
}

module.exports = {
	generateMetadataBlock,
	getWebpackConfig,
}