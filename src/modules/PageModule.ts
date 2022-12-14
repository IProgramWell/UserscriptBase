import { bindMethods } from "../utils/ObjUtils";
import IOManager from "../utils/IOManager";
import * as urlUtils from "../utils/URLUtils";
import * as pageUtils from "../utils/PageUtils";

import type QueryAwaiter from "../utils/QueryAwaiter";
import type { GeneralTypes, Interfaces } from "../../types";

export class PageModule
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
		init?(): boolean;
		onDocumentLoad?(): boolean;
		onDocumentStart?(): boolean;
		onModuleStart?(): boolean;
		onModuleStop?(): boolean;
	} = {};
	readonly methods: {
		[methodName: PropertyKey]: (...args: any) => any
	} = {};
	readonly shouldBeActive: (url?: string | URL | Location) => boolean = () => true;
	readonly moduleName: string | null | undefined = null;
	readonly logger: Interfaces.ILogger = IOManager.GLOBAL_MANAGER;
	readonly utils: {
		urlUtils: Interfaces.IURLUtils,
		pageUtils: Interfaces.IPageUtils,
		queryAwaiter?: QueryAwaiter,
	} = { urlUtils, pageUtils, };

	state: Record<PropertyKey, any> = {};
	isActive: boolean = false;

	constructor (moduleDetails: {
		eventHandlers?: PageModule["eventHandlers"],
		methods?: PageModule["methods"],
		utils?: PageModule["utils"],
		shouldBeActive?: PageModule["shouldBeActive"],
		moduleName?: string,
		logger?: Interfaces.ILogger,
	})
	{
		bindMethods({ source: this });

		if (moduleDetails.shouldBeActive)
			this.shouldBeActive = moduleDetails.shouldBeActive.bind(this);

		for (
			let [methodName, methodFunc]
			of (
				Object.entries(moduleDetails.eventHandlers ?? {}) as
				GeneralTypes.EntryArray<PageModule["eventHandlers"]>
			)
		)
			if (typeof methodFunc === "function")
				this.eventHandlers[methodName] = methodFunc.bind(this);

		for (
			let [methodName, methodFunc]
			of (
				Object.entries(moduleDetails.methods ?? {}) as
				GeneralTypes.EntryArray<PageModule["methods"]>
			)
		)
			if (typeof methodFunc === "function")
				this.methods[methodName] = methodFunc.bind(this);

		if (moduleDetails.logger)
			this.logger = moduleDetails.logger;

		if (moduleDetails.moduleName)
			this.moduleName = moduleDetails.moduleName;

		if (moduleDetails.utils)
			this.utils = moduleDetails.utils;
	}

	getStateValue<T>(
		name: keyof PageModule["state"],
		defaultValue: T | null = null
	): T | null | undefined
	{
		return this.state[name] ?? defaultValue;
	}

	setStateValue<T>(name: keyof PageModule["state"], value: T): void
	{
		this.state[name] = value;
	}
}
export default PageModule;