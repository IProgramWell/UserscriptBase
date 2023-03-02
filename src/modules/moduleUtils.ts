import IOManager from "../utils/IOManager";

import type PageModule from "./PageModule";
import type { ILogger } from "../../types/Interfaces";

export function onModuleEvent<
	HN extends keyof PageModule["eventHandlers"],
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
				newIsActive = module.eventHandlers[options.eventHandlerName]?.();
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
				module.methods?.[options.methodName]?.(...options.methodArgs);
			}
		}
		catch (err)
		{
			logger.error({
				err,
				module,
				methodName: options.methodName,
				methodArgs: options.methodArgs,
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
					module.isActive = module.eventHandlers.onModuleStart();
					logger.print(`Started module: "${module.moduleName}"`);
				}
			}
			else if (module.isActive && module.eventHandlers.onModuleStop)
			{
				module.isActive = module.eventHandlers.onModuleStop();
				logger.print(`Stopped module: "${module.moduleName}"`);
			}
		}
		catch (err)
		{
			logger.error(err, module);
		}
	}
}

export function activateForRegex(
	regex: RegExp | string,
	wholeUrl: boolean = false
): PageModule["shouldBeActive"]
{
	const ACTIVATE_REGEXP: RegExp = typeof regex === "string"
		? new RegExp(regex)
		: regex;
	return function (
		this: PageModule,
		url?: URL | string | Location
	): boolean
	{
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