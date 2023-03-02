import type PageModule from "./PageModule";
import type { ILogger } from "../../types/Interfaces";
export declare function onModuleEvent<HN extends keyof PageModule["eventHandlers"]>(options: {
    moduleList: PageModule[];
    eventHandlerName: HN;
    logger?: ILogger;
    currentLocation?: Location | URL | string | null;
    onlyIfShouldBeActive?: boolean;
}): void;
export declare function callAllModulesMethod(options: {
    moduleList: PageModule[];
    methodName: string;
    methodArgs: any[];
    logger?: ILogger;
    onlyIfShouldBeActive: boolean;
    currentLocation?: Location | URL | string | null;
}): void;
export declare function onUrlChange(options: {
    moduleList: PageModule[];
    logger?: ILogger;
    currentLocation?: Location | URL | string | null;
}): void;
export declare function activateForRegex(regex: RegExp | string, wholeUrl?: boolean): PageModule["shouldBeActive"];
