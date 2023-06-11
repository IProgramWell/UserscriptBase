import { bindMethods } from "../utils/ObjUtils";
import IOManager from "../utils/IOManager";
import * as urlUtils from "../utils/URLUtils";
import * as pageUtils from "../utils/PageUtils";

import type QueryAwaiter from "utils/QueryAwaiter";
import type { ILogger, IPageUtils, IURLUtils, } from "types/Interfaces";
import type { ModuleEvents, ModuleState } from "types/ModuleHelpers";

export class PageModule<
	E extends ModuleEvents = ModuleEvents,
	S extends ModuleState = ModuleState,
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
	readonly shouldBeActive: (this: PageModule<E, S>, url?: string | URL | Location) => boolean = function () { return true; };
	readonly moduleName: string | null | undefined = null;
	readonly logger: ILogger = IOManager.GLOBAL_MANAGER;
	readonly utils: {
		urlUtils: IURLUtils,
		pageUtils: IPageUtils,
		queryAwaiter?: QueryAwaiter,
	} = { urlUtils, pageUtils, };
	state = new Map<keyof S, S[keyof S]>();

	isActive: boolean = false;

	constructor (moduleDetails: {
		eventHandlers?: PageModule<E, S>["eventHandlers"],
		methods?: PageModule<E, S>["methods"],
		utils?: Partial<PageModule<E, S>["utils"]>,
		shouldBeActive?: PageModule<E, S>["shouldBeActive"],
		moduleName?: string,
		logger?: ILogger,
		initialState?: S,
	})
	{
		bindMethods({ source: this });

		if (moduleDetails.shouldBeActive)
			this.shouldBeActive = moduleDetails.shouldBeActive.bind(this);

		bindMethods({
			source: moduleDetails.eventHandlers ?? {},
			assignTo: this.eventHandlers,
			bindTo: this,
		});

		bindMethods({
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