import type PageModule from "./PageModule";
import type { ILogger } from "../../types/Interfaces";
export declare function onModuleEvent<HN extends keyof PageModule["eventHandlers"] = keyof PageModule["eventHandlers"], HF extends Required<PageModule["eventHandlers"]>[HN] = Required<PageModule["eventHandlers"]>[HN]>(options: {
    moduleList: PageModule[];
    eventHandlerName: HN;
    handlerArgs: Parameters<HF>;
    logger: ILogger;
    currentLocation?: Location | URL | string | null;
}): void;
export declare function callAllModulesMethod(options: {
    moduleList: PageModule[];
    methodName: string;
    methodArgs: any[];
    logger: ILogger;
    onlyIfShouldBeActive: boolean;
    currentLocation?: Location | URL | string | null;
}): void;
export declare function onUrlChange(options: {
    moduleList: PageModule[];
    logger?: ILogger;
    currentLocation?: Location | URL | string | null;
}): void;
export declare function activateForRegex(regex: RegExp | string, wholeUrl?: boolean): PageModule["shouldBeActive"];
