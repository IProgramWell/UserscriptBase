import IOManager from "../utils/IOManager";

import type PageModule from "./PageModule";
import type { ILogger } from "types/Interfaces";
import type { ModuleState, ModuleEvents } from "types/ModuleHelpers";

export function initModules(options: {
	moduleList: PageModule[];
	logger?: ILogger;
})
{
	for (let module of options.moduleList)
		module.eventHandlers.init?.call(module);
}

export function onModuleEvent<
	HN extends Exclude<keyof PageModule["eventHandlers"], "init">,
>(
	options: {
		moduleList: PageModule[],
		eventHandlerName: HN,
		logger?: ILogger,
		currentLocation?: Location | URL | string | null,
		onlyIfShouldBeActive?: boolean,
	}
): void
{
	let newIsActive: boolean;
	let logger = options.logger ?? IOManager.GLOBAL_MANAGER;
	for (let module of options.moduleList)
	{
		try
		{
			if (
				!options.onlyIfShouldBeActive ||
				module.isActive !== module.shouldBeActive(
					options.currentLocation ??
					module.utils.urlUtils.getCurrentLocation()
				)
			)
			{
				newIsActive = module.eventHandlers[options.eventHandlerName]?.call(module);
				if (
					typeof newIsActive === "boolean" &&
					newIsActive !== module.isActive
				)
				{
					module.isActive = newIsActive;
					logger.print(
						`${(newIsActive
							? "Started"
							: "Stopped"
						)} module: "${module.moduleName}"`
					);
				}
			}
		}
		catch (err)
		{
			logger.error(err, module);
		}
	}
};

export function callAllModulesMethod(options: {
	moduleList: PageModule[],
	methodName: string,
	methodArgs: any[],
	logger?: ILogger,
	onlyIfShouldBeActive: boolean,
	currentLocation?: Location | URL | string | null,
}): void
{
	let logger = options.logger ?? IOManager.GLOBAL_MANAGER;
	for (let module of options.moduleList)
	{
		try
		{
			if (
				!options.onlyIfShouldBeActive ||
				module.shouldBeActive(
					options.currentLocation ??
					module.utils.urlUtils.getCurrentLocation()
				)
			)
			{
				module.methods?.[options.methodName]?.call(module, ...options.methodArgs);
			}
		}
		catch (err)
		{
			logger.error({
				"error": err,
				"module": module,
				"methodName": options.methodName,
				"methodArgs": options.methodArgs,
			});
		}
	}
}

export function onUrlChange(options: {
	moduleList: PageModule[],
	logger?: ILogger,
	currentLocation?: Location | URL | string | null,
}): void
{
	let logger = options.logger ?? IOManager.GLOBAL_MANAGER;
	for (let module of options.moduleList)
	{
		try
		{
			if (module.shouldBeActive(
				options.currentLocation ??
				module.utils.urlUtils.getCurrentLocation()
			))
			{
				if (!module.isActive && module.eventHandlers.onModuleStart)
				{
					module.isActive = module.eventHandlers.onModuleStart.call(module);
					logger.print(`Started module: "${module.moduleName}"`);
				}
			}
			else if (module.isActive && module.eventHandlers.onModuleStop)
			{
				module.isActive = module.eventHandlers.onModuleStop.call(module);
				logger.print(`Stopped module: "${module.moduleName}"`);
			}
		}
		catch (err)
		{
			logger.error(err, module);
		}
	}
}

export function activateForRegex<
	E extends ModuleEvents = ModuleEvents,
	S extends ModuleState = ModuleState,
>(
	regex: RegExp | string,
	wholeUrl: boolean = false
): PageModule<E, S>["shouldBeActive"]
{
	const ACTIVATE_REGEXP: RegExp = typeof regex === "string"
		? new RegExp(regex)
		: regex;
	return function (
		this: PageModule<E, S>,
		url: URL | string | Location
	): boolean
	{
		if (this.isDisabled)
			return false;
		const TEST_URL: URL | Location = url
			? (typeof url === "string"
				? new URL(url)
				: url
			)
			: this.utils.urlUtils.getCurrentLocation();

		return ACTIVATE_REGEXP.test(wholeUrl
			? TEST_URL.href
			: TEST_URL.pathname
		);
	}
}