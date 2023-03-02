import { bindMethods } from "../utils/ObjUtils";
import IOManager from "../utils/IOManager";
import * as urlUtils from "../utils/URLUtils";
import * as pageUtils from "../utils/PageUtils";

import type QueryAwaiter from "../utils/QueryAwaiter";
import type { EntryArray, Func } from "types/GeneralTypes";
import type { ILogger, IPageUtils, IURLUtils, } from "types/Interfaces";

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
	readonly methods: { [methodName: PropertyKey]: Func<any, any> } = {};
	readonly shouldBeActive: Func<[url: string | URL | Location | undefined], boolean> = function ()
	{
		return true;
	};
	readonly moduleName: string | null | undefined = null;
	readonly logger: ILogger = IOManager.GLOBAL_MANAGER;
	readonly utils: {
		urlUtils: IURLUtils,
		pageUtils: IPageUtils,
		queryAwaiter?: QueryAwaiter,
	} = { urlUtils, pageUtils, };

	state = new Map<PropertyKey, any>();
	isActive: boolean = false;

	constructor (moduleDetails: {
		eventHandlers?: PageModule["eventHandlers"],
		methods?: PageModule["methods"],
		utils?: PageModule["utils"],
		shouldBeActive?: PageModule["shouldBeActive"],
		moduleName?: string,
		logger?: ILogger,
	})
	{
		bindMethods({ source: this });

		if (moduleDetails.shouldBeActive)
			this.shouldBeActive = moduleDetails.shouldBeActive.bind(this);

		for (
			let [methodName, methodFunc]
			of (
				Object.entries(moduleDetails.eventHandlers ?? {}) as
				EntryArray<PageModule["eventHandlers"]>
			)
		)
			if (typeof methodFunc === "function")
				this.eventHandlers[methodName] = methodFunc.bind(this);

		for (
			let [methodName, methodFunc]
			of (
				Object.entries(moduleDetails.methods ?? {}) as
				EntryArray<PageModule["methods"]>
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

	getStateValue<T, R = T | null>(
		name: PropertyKey,
		defaultValue: R = null
	): R
	{
		return this.state.get(name) ?? defaultValue;
	}

	setStateValue<T>(name: PropertyKey, value: T): void
	{
		this.state.set(name, value);
	}
}
export default PageModule;