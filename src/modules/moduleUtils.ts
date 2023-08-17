import IOManager from "../utils/IOManager";

import type PageModule from "./PageModule";
import type { ILogger } from "types/Interfaces";

export function initModules(options: {
	moduleList: PageModule[];
	logger?: ILogger;
})
{
	for (let module of options.moduleList)
		if (!module.isDisabled())
			module.eventHandlers.init?.call(module);
}

export function onModuleEvent<
	HN extends Exclude<keyof PageModule["eventHandlers"], "init">,
>(options: {
	moduleList: PageModule[],
	eventHandlerName: HN,
	logger?: ILogger,
	currentLocation?: Location | URL | string | null,
}): void
{
	let logger = options.logger ?? IOManager.GLOBAL_MANAGER;
	let wasActive: boolean;
	for (let module of options.moduleList)
	{
		try
		{
			wasActive = module.isActive();

			if (module.onModuleEvent(options.eventHandlerName))
			{
				if (!wasActive)
					logger.print(`Module "${module.moduleName}" has started!`);
			}
			else if (wasActive)
				logger.print(`Module "${module.moduleName}" has stopped!`);
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
				!module.isDisabled() &&
				(
					!options.onlyIfShouldBeActive ||
					module.shouldBeActive(
						options.currentLocation ??
						module.utils.urlUtils.getCurrentLocation()
					)
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
	let wasActive: boolean;
	for (let module of options.moduleList)
	{
		if (module.isDisabled())
			continue;
		try
		{
			wasActive = module.isActive();

			if (module.onModuleEvent("onModuleStart"))
			{
				if (!wasActive)
					logger.print(`Started module: "${module.moduleName}"`);
			}
			else if (wasActive)
				logger.print(`Stopped module: "${module.moduleName}"`);
		}
		catch (err)
		{
			logger.error(err, module);
		}
	}
}

export function activateForRegex<S extends Record<PropertyKey, any> = {}>(
	regex: RegExp | string,
	wholeUrl: boolean = false
): PageModule<S>["shouldBeActive"]
{
	const ACTIVATE_REGEXP: RegExp = typeof regex === "string"
		? new RegExp(regex)
		: regex;
	return function (
		this: PageModule<S>,
		url: URL | string | Location
	): boolean
	{
		if (this.isDisabled())
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