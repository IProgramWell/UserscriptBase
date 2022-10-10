import { AutoBound } from "./ObjUtils";
import IOManager from "./IOManager";
import { getCurrentLocation } from "./URLUtils";
import { onUrlChange } from "../modules/moduleUtils";

import type PageModule from "../modules/PageModule";
import type { ILogger } from "../../types/Interfaces";

export default class PathWatcher extends AutoBound
{
	static readonly DEFAULT_WATCHER_OPTIONS: {
		moduleList: PageModule[],
		logger: ILogger,
		watchWholeURL: boolean,
		onUrlChange: typeof onUrlChange,
		ObserverClass: typeof MutationObserver,
		getCurrentLocation: typeof getCurrentLocation,
	} = {
			moduleList: [],
			logger: IOManager.GLOBAL_MANAGER,
			watchWholeURL: false,
			onUrlChange,
			ObserverClass: MutationObserver,
			getCurrentLocation,
		};

	readonly observerInstance: MutationObserver;
	readonly logger: ILogger;
	readonly moduleList: PageModule[];
	readonly watchWholeURL: boolean = false;
	readonly urlChangeHandler: typeof onUrlChange = onUrlChange;
	readonly getCurrentLocation: typeof getCurrentLocation = getCurrentLocation;

	lastURL: string;

	constructor (options: Partial<typeof PathWatcher.DEFAULT_WATCHER_OPTIONS> = PathWatcher.DEFAULT_WATCHER_OPTIONS)
	{
		super();

		let fullOptions = {
			...PathWatcher.DEFAULT_WATCHER_OPTIONS,
			...options,
		};

		this.lastURL = "";
		this.observerInstance = new fullOptions.ObserverClass(this.onUrlChange);
		this.logger = fullOptions.logger;
		this.moduleList = fullOptions.moduleList;
		this.watchWholeURL = fullOptions.watchWholeURL;
		this.urlChangeHandler = fullOptions.onUrlChange.bind(this);
		this.getCurrentLocation = fullOptions.getCurrentLocation.bind(this);
	}

	onUrlChange()
	{
		let location = this.getCurrentLocation(),
			url = this.watchWholeURL
				? location.href
				: location.pathname;

		if (this.lastURL === url)
			return;
		this.lastURL = url;
		this.logger.print(
			"Changed url!",
			`New ${this.watchWholeURL ? "url" : "pathname"}: "${url}"`
		);
		this.urlChangeHandler({
			moduleList: this.moduleList,
			currentLocation: this.getCurrentLocation(),
			logger: this.logger,
		});
	}

	start()
	{
		this.observerInstance.observe(
			document,
			{
				subtree: true,
				childList: true,
				attributeFilter: ["location"]
			}
		);
	}
};