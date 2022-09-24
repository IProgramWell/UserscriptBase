import PageModule from "./PageModule";
import IOManager from "../utils/IOManager";
import { getCurrentLocation } from "../utils/URLUtils";

export function onModuleEvent<
	HN extends keyof PageModule["eventHandlers"] = keyof PageModule["eventHandlers"],
	HF extends Required<PageModule["eventHandlers"]>[HN] = Required<PageModule["eventHandlers"]>[HN],
>(
	options: {
		moduleList: PageModule[],
		eventHandlerName: HN,
		handlerArgs: Parameters<HF>,
		logger: IOManager,
	}
)
{
	let newIsActive: boolean;
	for (let module of options.moduleList)
	{
		try
		{
			if (module.isActive !== module.shouldBeActive(getCurrentLocation()))
			{
				newIsActive = (
					module.eventHandlers[options.eventHandlerName] as
					//I hate that I have to use `as` EVERYWHERE in typecript
					(...args: Parameters<HF>) => ReturnType<HF>
				)
					?.(...options.handlerArgs);
				/* newIsActive = module.eventHandlers[
					options.eventHandlerName
				]?.(
					...options.handlerArgs
				); */
				if (typeof newIsActive === "boolean")
				{
					module.isActive = newIsActive;
					options.logger.print(
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
			options.logger.error(err, module);
		}
	}
};

export function callAllModulesMethod(options: {
	moduleList: PageModule[],
	methodName: string,
	methodArgs: any[],
	logger: IOManager,
	onlyIfShouldBeActive: boolean
})
{
	for (let module of options.moduleList)
	{
		try
		{
			if (!options.onlyIfShouldBeActive || module.shouldBeActive(getCurrentLocation()))
				module.methods?.[options.methodName]?.(...options.methodArgs);
		}
		catch (err)
		{
			options.logger.error({
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
	logger: IOManager,
	currentLocation: Location | URL | string,
})
{
	for (let module of options.moduleList)
	{
		try
		{
			if (module.shouldBeActive(options.currentLocation))
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
			options.logger.error(err, module);
		}
	}
}

export function activateForRegex(
	regex: RegExp | string,
	wholeUrl: boolean = false
)
{
	const ACTIVATE_REGEXP = typeof regex === "string"
		? new RegExp(regex)
		: regex;
	return function (
		this: PageModule,
		url?: URL | string | Location
	): boolean
	{
		const TEST_URL = url
			? (typeof url === "string"
				? new URL(url)
				: url
			)
			: this.getCurrentLocation();

		return ACTIVATE_REGEXP.test(wholeUrl
			? TEST_URL.href
			: TEST_URL.pathname
		);
	}
}