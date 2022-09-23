import * as utils from "../utils";

import type {
	GeneralTypes,
	ModuleTypes,
} from "../../types";

export class PageModule extends utils.ObjUtils.AutoBound
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
		init?: ModuleTypes.ModuleEventHandler<[], boolean>;
		onDocumentLoad?: ModuleTypes.ModuleEventHandler<[], boolean>;
		/**
		 * Technically useless because `onModuleStart`
		 * runs when the document is started, too.
		 */
		onDocumentStart?: ModuleTypes.ModuleEventHandler<[], boolean>;
		onModuleStart?: ModuleTypes.ModuleEventHandler<[], boolean>;
		onModuleStop?: ModuleTypes.ModuleEventHandler<[], boolean>;
	} = {};
	readonly methods: {
		[methodName: PropertyKey]: (...args: any) => any
	} = {};
	readonly shouldBeActive: (url?: string | URL | Location) => boolean = () => true;
	readonly moduleName: string | null | undefined = null;
	readonly logger: utils.IOManager = utils.IOManager.GLOBAL_MANAGER;
	readonly utils: {
		urlUtils: typeof utils.URLUtils,
		pageUtils: typeof utils.PageUtils,
	} = {
			urlUtils: utils.URLUtils,
			pageUtils: utils.PageUtils,
		};

	state: Record<PropertyKey, any> = {};
	isActive: boolean = false;

	constructor (moduleDetails: {
		eventHandlers?: PageModule["eventHandlers"],
		methods?: PageModule["methods"],
		utils?: PageModule["utils"],
		shouldBeActive?: PageModule["shouldBeActive"],
		moduleName?: string,
		logger?: utils.IOManager,
	})
	{

		super();

		if (moduleDetails.shouldBeActive)
			this.shouldBeActive = moduleDetails.shouldBeActive.bind(this);
		else
			throw new Error("Path regex not specified");

		if (moduleDetails.eventHandlers)
		{
			/* Object.assign(
				this.eventHandlers,
				arrToObj(
					Object.entries(moduleDetails.eventHandlers),
					([eventHandlerName]) => eventHandlerName,
					([_, eventHandler]) => eventHandler.bind(this)
				)
			); */
			for (
				let [methodName, methodFunc]
				of (
					Object.entries(moduleDetails.eventHandlers) as
					GeneralTypes.EntryArray<PageModule["eventHandlers"]>
				)
			)
			{
				if (typeof methodFunc === "function")
				{
					(
						this.eventHandlers[methodName] as
						PageModule["eventHandlers"][typeof methodName]
					)
						= methodFunc.bind(this);
				}
			}
		}
		if (moduleDetails.methods)
		{
			/* Object.assign(
				this.methods,
				arrToObj(
					Object.entries(moduleDetails.methods),
					([methodName]) => methodName,
					([_, methodFunc]) => methodFunc.bind(this)
				)
			); */
			for (
				let [methodName, methodFunc]
				of (
					Object.entries(moduleDetails.methods) as
					GeneralTypes.EntryArray<PageModule["methods"]>
				)
			)
			{
				if (typeof methodFunc === "function")
				{
					(
						this.methods[methodName] as
						PageModule["methods"][typeof methodName]
					)
						= methodFunc.bind(this);
				}
			}
		}

		if (moduleDetails.logger)
			this.logger = moduleDetails.logger;

		if (moduleDetails.moduleName)
			this.moduleName = moduleDetails.moduleName;

		if (moduleDetails.utils)
			this.utils = moduleDetails.utils;
	}

	getStateValue<T>(name: keyof PageModule["state"], defaultValue: T | null = null): T | null | undefined
	{
		return this.state[name] ?? defaultValue;
	}

	setStateValue<T>(name: keyof PageModule["state"], value: T)
	{
		this.state[name] = value;
	}
}
export default PageModule;