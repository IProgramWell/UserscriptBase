import { bindMethods } from "./ObjUtils";
import { isScriptInIFrame } from "./PageUtils";

import type { ILogger } from "../../types/Interfaces";
import type { IOManagerOptions, TimeStampFormat } from "types/UtilityTypes";

export default class IOManager implements ILogger
{
	static readonly IFRAME_LOG_PREFIX: string = "iframe";
	static readonly DEFAULT_LOGGER_OPTIONS: IOManagerOptions = {
		name: globalThis.GM_info
			? `${globalThis.GM_info.script.name} v${globalThis.GM_info.script.version}`
			: "",
		logTimestamp: true,
		timestampFormat: "Locale",
		isInIFrame: isScriptInIFrame(),
	};
	static readonly GLOBAL_MANAGER = new IOManager();

	scriptName: string;
	logTimestamp: boolean;
	timestampFormat: TimeStampFormat;
	isInIFrame: boolean = false;

	constructor (
		loggerOptions:
			Partial<IOManagerOptions> =
			IOManager.DEFAULT_LOGGER_OPTIONS
	)
	{
		const options = {
			...IOManager.DEFAULT_LOGGER_OPTIONS,
			...loggerOptions,
		};
		bindMethods({ source: this });

		this.scriptName = options.name;
		this.logTimestamp = options.logTimestamp;
		this.timestampFormat = options.timestampFormat;
		this.isInIFrame = options.isInIFrame ?? false;
	}

	getTimestamp(): string
	{
		switch (this.timestampFormat)
		{
			case "UTC":
				return new Date().toUTCString();
			case "ISO":
				return new Date().toISOString();
			case "Locale":
				return new Date().toLocaleString();
			case "Milliseconds":
				return new Date().getTime().toString();
			case "Human":
			default:
				return new Date().toString();
		}
	}

	getPrefix(includeTimestamp: boolean = false, addSpace: boolean = false): string
	{
		return [
			includeTimestamp && this.getTimestamp(),
			this.isInIFrame && IOManager.IFRAME_LOG_PREFIX,
			this.scriptName,
		]
			.reduce(
				function (prefixes, prfx)
				{
					if (prfx)
						prefixes.push(`[${prfx}]`);
					return prefixes;
				},
				[]
			)
			.join(" ") + ":" + (addSpace ? " " : "");
	}

	print(...messages: (string | any)[]): void
	{
		console.log(
			this.getPrefix(this.logTimestamp, false),
			...messages
		);
	}

	error(...errors: (string | any)[]): void
	{
		console.error(
			this.getPrefix(this.logTimestamp, false),
			...errors
		);
	}
}