import { AutoBound } from "./ObjUtils";
import IOManager from "./IOManager";
import { getCurrentLocation } from "./URLUtils";
import { onUrlChange } from "../modules/moduleUtils";

import type PageModule from "../modules/PageModule";

const DEFAULT_CTOR_OPTIONS: {
	moduleList: PageModule[],
	logger: IOManager,
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
export default class PathWatcher extends AutoBound
{
	readonly observerInstance: MutationObserver;
	readonly logger: IOManager;
	readonly moduleList: PageModule[];
	readonly watchWholeURL: boolean = false;
	readonly urlChangeHandler: typeof onUrlChange;
	readonly getCurrentLocation: typeof getCurrentLocation;

	lastURL: string;

	constructor (options: Partial<typeof DEFAULT_CTOR_OPTIONS> = DEFAULT_CTOR_OPTIONS)
	{
		super();

		let fullOptions = {
			...DEFAULT_CTOR_OPTIONS,
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