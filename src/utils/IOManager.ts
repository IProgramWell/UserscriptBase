import { bindMethods } from "./ObjUtils";
import { isScriptInIFrame } from "./PageUtils";

import type { ILogger } from "../../types/Interfaces";
import type { IOManagerOptions, TimeStampFormat } from "types/UtilityTypes";

export default class IOManager implements ILogger
{
	static readonly IFRAME_LOG_PREFIX: string = "iframe";
	static readonly DEFAULT_LOGGER_OPTIONS: IOManagerOptions = {
		name: globalThis.GM_info
			? GM_info.script.name + " v" + GM_info.script.version
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

	static getTimestamp(timestampFormat: TimeStampFormat = IOManager.DEFAULT_LOGGER_OPTIONS.timestampFormat): string
	{
		switch (timestampFormat)
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

	static joinPrefixes(prefixList: string[], addSpace: boolean = false): string
	{
		const formattedList: string[] = [];
		for (let prfx of prefixList)
			if (prfx)
				formattedList.push(`[${prfx}]`);
		return formattedList.join(" ") + ":" + (addSpace ? " " : "");
	}

	getPrefix(includeTimestamp: boolean = false, addSpace: boolean = false): string
	{
		const prefixList: string[] = [];
		if (includeTimestamp)
			prefixList.push(IOManager.getTimestamp(this.timestampFormat));
		if (this.isInIFrame)
			prefixList.push(IOManager.IFRAME_LOG_PREFIX);
		prefixList.push(this.scriptName);

		return IOManager.joinPrefixes(
			prefixList,
			addSpace
		);
	}

	print(...messages: (string | any)[]): void
	{
		console.log(
			this.getPrefix(
				this.logTimestamp,
				false
			),
			...messages
		);
	}

	error(...errors: (string | any)[]): void
	{
		console.error(
			this.getPrefix(
				this.logTimestamp,
				false
			),
			...errors
		);
	}

	prompt(
		message: string,
		defaultText: string,
		includeTimestamp: boolean = false
	): string | null
	{
		return globalThis.prompt(
			this.getPrefix(
				includeTimestamp,
				true
			) +
			message,
			defaultText
		);
	}

	alert(message: string, includeTimestamp: boolean = false): void
	{
		globalThis.alert(
			this.getPrefix(
				includeTimestamp,
				true
			) +
			message
		);
	}
}