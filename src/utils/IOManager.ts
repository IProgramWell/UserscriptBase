import { AutoBound } from "./ObjUtils";

const {
	script: {
		name: scriptName,
		version: scriptVersion
	}
} = globalThis.GM_info ?? { script: {} };
export default class IOManager extends AutoBound
{
	static readonly IFRAME_LOG_PREFIX: string = "iframe";
	static readonly DEFAULT_LOGGER_OPTIONS: {
		name: string,
		logTimestamp: boolean,
		timestampFormat: IOManager["timestampFormat"],
		detectIFrames: boolean,
	} = {
			name: globalThis.GM_info
				? `${scriptName} v${scriptVersion}`
				: "",
			logTimestamp: true,
			timestampFormat: "Locale",
			detectIFrames: true
		};
	static GLOBAL_MANAGER = new IOManager();

	scriptName: string;
	logTimestamp: boolean;
	timestampFormat: "ISO" | "UTC" | "Locale" | "Milliseconds" | "Human";
	isInIFrame: boolean = false;

	constructor (
		loggerOptions:
			Partial<typeof IOManager["DEFAULT_LOGGER_OPTIONS"]> =
			IOManager.DEFAULT_LOGGER_OPTIONS
	)
	{
		const options = {
			...IOManager.DEFAULT_LOGGER_OPTIONS,
			...loggerOptions,
		};
		super();

		this.scriptName = options.name;
		this.logTimestamp = options.logTimestamp;
		this.timestampFormat = options.timestampFormat;
		this.isInIFrame = options.detectIFrames && globalThis.self !== globalThis.top;
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

	joinPrefixes(prefixList: string[], addSpace: boolean = false): string
	{
		return prefixList
			.reduce(
				(list: string[], prfx: string) =>
				{
					if (prfx)
						list.push(`[${prfx}]`);
					return list;
				},
				[]
			)
			.join(" ") + ":" +
			(addSpace ? " " : "");
	}

	getPrefix(includeTimestamp: boolean = false, addSpace: boolean = false): string
	{
		const prefixList: string[] = [];
		if (includeTimestamp)
			prefixList.push(this.getTimestamp());
		if (this.isInIFrame)
			prefixList.push(IOManager.IFRAME_LOG_PREFIX);
		prefixList.push(this.scriptName);

		return this.joinPrefixes(
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
	): ReturnType<typeof globalThis.prompt>
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