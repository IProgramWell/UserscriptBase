import IOManager from "../utils/IOManager";

import type PageModule from "./PageModule";
import type { ILogger } from "../../types/Interfaces";

export function onModuleEvent<
	HN extends keyof PageModule["eventHandlers"] = keyof PageModule["eventHandlers"],
	HF extends Required<PageModule["eventHandlers"]>[HN] = Required<PageModule["eventHandlers"]>[HN],
>(
	options: {
		moduleList: PageModule[],
		eventHandlerName: HN,
		handlerArgs: Parameters<HF>,
		logger?: ILogger,
		currentLocation?: Location | URL | string | null,
	}
)
{
	let newIsActive: boolean;
	for (let module of options.moduleList)
	{
		try
		{
			if (
				module.isActive !== module.shouldBeActive(
					options.currentLocation ??
					module.utils.urlUtils.getCurrentLocation()
				)
			)
			{
				newIsActive = (
					module.eventHandlers[options.eventHandlerName] as
					//I hate that I have to use `as` EVERYWHERE in typecript
					(...args: Parameters<HF>) => ReturnType<HF>
				)?.(...(options.handlerArgs));
				if (
					typeof newIsActive === "boolean" &&
					newIsActive !== module.isActive
				)
				{
					module.isActive = newIsActive;
					(options.logger ?? IOManager.GLOBAL_MANAGER).print(
						(newIsActive
							? "Started"
							: "Stopped"
						) +
						` module: "${module.moduleName}"`
					);
				}
			}
		}
		catch (err)
		{
			(options.logger ?? IOManager.GLOBAL_MANAGER).error(err, module);
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
})
{
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
			(options.logger ?? IOManager.GLOBAL_MANAGER).error({
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
})
{
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
					options.logger?.print(`Started module: "${module.moduleName}"`);
				}
			}
			else if (module.isActive && module.eventHandlers.onModuleStop)
			{
				module.isActive = module.eventHandlers.onModuleStop();
				options.logger?.print(`Stopped module: "${module.moduleName}"`);
			}
		}
		catch (err)
		{
			(options.logger ?? IOManager.GLOBAL_MANAGER).error(err, module);
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