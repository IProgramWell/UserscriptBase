import PageModule from "./PageModule";
import * as utils from "../utils";
export declare function onModuleEvent<HN extends keyof Required<PageModule["eventHandlers"]> = keyof Required<PageModule["eventHandlers"]>, HF extends Required<PageModule["eventHandlers"]>[HN] = Required<PageModule["eventHandlers"]>[HN]>(options: {
    moduleList: PageModule[];
    eventHandlerName: HN;
    handlerArgs: Parameters<HF>;
    logger: utils.IOManager;
}): void;
export declare function callAllModulesMethod(options: {
    moduleList: PageModule[];
    methodName: string;
    methodArgs: any[];
    logger: utils.IOManager;
    onlyIfShouldBeActive: boolean;
}): void;
export declare function onUrlChange(options: {
    moduleList: PageModule[];
    logger: utils.IOManager;
    currentLocation: Location | URL | string;
}): void;
export declare function activateForRegex(regex: RegExp | string, wholeUrl?: boolean): (this: PageModule, url?: URL | string | Location) => boolean;
