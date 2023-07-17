// import { bindMethods } from "utils/ObjUtils";
/* import IOManager from "utils/IOManager";
import * as urlUtils from "utils/URLUtils";
import * as pageUtils from "utils/PageUtils";
import * as requestUtils from "utils/RequestUtils"; */
import
{
	URLUtils as urlUtils,
	PageUtils as pageUtils,
	RequestUtils as requestUtils,
	IOManager,
	ObjUtils,
} from "../utils";
import * as moduleUtils from "./moduleUtils";

import type QueryAwaiter from "../utils/QueryAwaiter";
import type {
	ILogger,
	IPageUtils,
	IURLUtils,
	IRequestUtils,
} from "types/Interfaces";
import type { ModuleEvents, ModuleState } from "types/ModuleHelpers";

export class PageModule<
	E extends ModuleEvents = ModuleEvents,
	S extends ModuleState = ModuleState
>
{
	/**
	 * A collection of per module event handlers,
	 * bound to the current module instance.
	 * 
	 * All event handlers should return a boolean value
	 * indicating whether the current module is active or not.
	 * 
	 */
	readonly eventHandlers: E = {} as E;
	readonly methods: Record<PropertyKey, (this: PageModule<E, S>, ...args: any) => any> = {};
	readonly shouldBeActive: (this: PageModule<E, S>, url?: string | URL | Location) => boolean = function ()
	{
		return this.activationState !== -1;
	};
	readonly moduleName: string | null | undefined = null;
	readonly logger: ILogger = IOManager.GLOBAL_MANAGER;
	readonly utils: {
		urlUtils: IURLUtils;
		pageUtils: IPageUtils;
		requestUtils: IRequestUtils;
		queryAwaiter?: QueryAwaiter;
	} = { urlUtils, pageUtils, requestUtils };
	state = new Map<keyof S, S[keyof S]>;

	// isActive: boolean = false;
	/**
	 * 	- -1 = Disabled
	 * 	- 0 = Off - not active, but can be activated.
	 * 	- 1 = On - active
	 */
	private activationState: -1 | 0 | 1 = 0;

	get isActive() { return this.activationState !== 1; }
	set isActive(value: boolean)
	{
		if (this.activationState !== -1)
			this.activationState = value ? 1 : 0;
	}

	get isDisabled() { return this.activationState === -1; }
	set isDisabled(value: boolean) { this.activationState = value ? -1 : 0; }

	constructor (moduleDetails: {
		eventHandlers?: PageModule<E, S>["eventHandlers"],
		methods?: PageModule<E, S>["methods"],
		utils?: Partial<PageModule<E, S>["utils"]>,
		shouldBeActive?: { (this: PageModule<E, S>, url?: string | URL | Location): boolean; } | RegExp,
		moduleName?: string,
		logger?: ILogger,
		initialState?: S,
	})
	{
		ObjUtils.bindMethods({ source: this });

		if (moduleDetails.shouldBeActive)
		{
			if (typeof moduleDetails.shouldBeActive === "function")
				this.shouldBeActive = moduleDetails.shouldBeActive.bind(this);
			else if (moduleDetails.shouldBeActive instanceof RegExp)
				this.shouldBeActive = moduleUtils
					.activateForRegex<E, S>(moduleDetails.shouldBeActive, false)
					.bind(this);
		}

		ObjUtils.bindMethods({
			source: moduleDetails.eventHandlers ?? {},
			assignTo: this.eventHandlers,
			bindTo: this,
		});

		ObjUtils.bindMethods({
			source: moduleDetails.methods ?? {},
			assignTo: this.methods,
			bindTo: this,
		});

		if (moduleDetails.logger)
			this.logger = moduleDetails.logger;

		if (moduleDetails.moduleName)
			this.moduleName = moduleDetails.moduleName;

		if (moduleDetails.utils)
			Object.assign(this.utils, moduleDetails.utils);
	}

	getStateValue<K extends keyof S = keyof S>(
		name: K,
		defaultValue: S[K]
	): S[K]
	{
		return this.state.get(name) as S[K] ?? defaultValue;
	}

	setStateValue<K extends keyof S = keyof S>(name: K, value: S[K]): void
	{
		this.state.set(name, value);
	}

	removeStateValue(name: keyof S): void
	{
		this.state.delete(name);
	}
}
export default PageModule;