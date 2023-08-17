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

export class PageModule<S extends Record<PropertyKey, any> = {}>
{
	/**
	 * A collection of per module event handlers,
	 * bound to the current module instance.
	 * 
	 * All event handlers should return a boolean value
	 * indicating whether the current module is active or not.
	 * 
	 */
	readonly eventHandlers: {
		init?(this: PageModule<S>): void;
		onDocumentLoad?(this: PageModule<S>): boolean;
		onDocumentStart?(this: PageModule<S>): boolean;
		onModuleStart?(this: PageModule<S>): boolean;
		onModuleStop?(this: PageModule<S>): boolean;
	} = {};
	readonly methods: Record<PropertyKey, (this: PageModule<S>, ...args: any) => any> = {};
	readonly shouldBeActive: (this: PageModule<S>, url?: string | URL | Location) => boolean = function ()
	{
		return !this.isDisabled();
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

	/**
	 * 	- -1 = Disabled
	 * 	- 0 = Off - not active, but can be activated.
	 * 	- 1 = On - active
	 */
	private activationState: -1 | 0 | 1 = 0;

	constructor (moduleDetails: {
		eventHandlers?: PageModule<S>["eventHandlers"],
		methods?: PageModule<S>["methods"],
		utils?: Partial<PageModule<S>["utils"]>,
		shouldBeActive?: { (this: PageModule<S>, url?: string | URL | Location): boolean; } | RegExp,
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
					.activateForRegex<S>(moduleDetails.shouldBeActive, false)
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

	isDisabled(this: PageModule<S>): boolean { return this.activationState === -1; }
	disable(this: PageModule<S>): void
	{
		if (this.isActive())
			// I hate this. I hate this SO MUCH. WHY DO YOU DO THIS TO ME, TYPESCRIPT???
			// TODO: Rework this shit.
			this.eventHandlers.onModuleStop?.call(this);
		this.activationState = -1;
	}
	enable(this: PageModule<S>, activate: boolean = false): void
	{
		this.activationState = (
			activate &&
			this.shouldBeActive(this.utils.urlUtils.getCurrentLocation()) &&
			this.eventHandlers.onModuleStart?.call(this)
		)
			? 1
			: 0;
	}

	isActive(this: PageModule<S>): boolean { return this.activationState === 1; }
	activate(this: PageModule<S>): boolean
	{
		if (
			this.activationState === 0 &&
			this.eventHandlers.onModuleStart?.call(this)
		)
		{
			this.activationState = 1;
			return true;
		}
		return false;
	}
	deactivate(this: PageModule<S>): boolean
	{
		if (
			this.activationState === 1 &&
			!this.eventHandlers.onModuleStop?.call(this)
		)
		{
			this.activationState = 0;
			return false;
		}
		return true;
	}
}
export default PageModule;