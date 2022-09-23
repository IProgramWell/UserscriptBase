import IOManager from "../utils/IOManager";
import PageModule from "./PageModule";
export declare function onModuleEvent<HN extends keyof Required<PageModule["eventHandlers"]> = keyof Required<PageModule["eventHandlers"]>, HF extends Required<PageModule["eventHandlers"]>[HN] = Required<PageModule["eventHandlers"]>[HN]>(options: {
    moduleList: PageModule[];
    eventHandlerName: HN;
    handlerArgs: Parameters<HF>;
    logger: IOManager;
}): void;
export declare function callAllModulesMethod(options: {
    moduleList: PageModule[];
    methodName: string;
    methodArgs: any[];
    logger: IOManager;
    onlyIfShouldBeActive: boolean;
}): void;
export declare function onUrlChange(options: {
    moduleList: PageModule[];
    logger: IOManager;
    currentLocation: Location | URL | string;
}): void;
export declare function activateForRegex(regex: RegExp | string, wholeUrl?: boolean): (this: PageModule, url?: URL | string | Location) => boolean;
