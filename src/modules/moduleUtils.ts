import PageModule from "./PageModule";
import * as utils from "../utils";

export function onModuleEvent<
	HN extends keyof Required<PageModule["eventHandlers"]> = keyof Required<PageModule["eventHandlers"]>,
	HF extends Required<PageModule["eventHandlers"]>[HN] = Required<PageModule["eventHandlers"]>[HN],
>(
	options: {
		moduleList: PageModule[],
		eventHandlerName: HN,
		handlerArgs: Parameters<HF>,
		logger: utils.IOManager,
	}
)
{
	let newIsActive: boolean;
	for (let module of options.moduleList)
	{
		try
		{
			if (module.isActive !== module.shouldBeActive(utils.URLUtils.getCurrentLocation()))
			{
				newIsActive = (
					module.eventHandlers[options.eventHandlerName] as
					//I hate that I have to use `as` EVERYWHERE in typecript
					(...args: Parameters<HF>) => ReturnType<HF>
				)
					?.(...options.handlerArgs);
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
	logger: utils.IOManager,
	onlyIfShouldBeActive: boolean
})
{
	for (let module of options.moduleList)
	{
		try
		{
			if (!options.onlyIfShouldBeActive || module.shouldBeActive(utils.URLUtils.getCurrentLocation()))
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
	logger: utils.IOManager,
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
			: this.utils.urlUtils.getCurrentLocation();

		return ACTIVATE_REGEXP.test(wholeUrl
			? TEST_URL.href
			: TEST_URL.pathname
		);
	}
}