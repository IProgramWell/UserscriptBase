import { AutoBound } from "./ObjUtils";
import IOManager from "./IOManager";
import { getCurrentLocation } from "./URLUtils";
import { onUrlChange } from "../modules/moduleUtils";
import type PageModule from "../modules/PageModule";
declare const DEFAULT_CTOR_OPTIONS: {
    moduleList: PageModule[];
    logger: IOManager;
    watchWholeURL: boolean;
    onUrlChange: typeof onUrlChange;
    ObserverClass: typeof MutationObserver;
    getCurrentLocation: typeof getCurrentLocation;
};
export default class PathWatcher extends AutoBound {
    readonly observerInstance: MutationObserver;
    readonly logger: IOManager;
    readonly moduleList: PageModule[];
    readonly watchWholeURL: boolean;
    readonly urlChangeHandler: typeof onUrlChange;
    readonly getCurrentLocation: typeof getCurrentLocation;
    lastURL: string;
    constructor(options?: Partial<typeof DEFAULT_CTOR_OPTIONS>);
    onUrlChange(): void;
    start(): void;
}
export {};
