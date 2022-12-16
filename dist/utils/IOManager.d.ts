import type { ILogger } from "../../types/Interfaces";
export default class IOManager implements ILogger {
    static readonly IFRAME_LOG_PREFIX: string;
    static readonly DEFAULT_LOGGER_OPTIONS: {
        name: string;
        logTimestamp: boolean;
        timestampFormat: IOManager["timestampFormat"];
        detectIFrames(): boolean;
    };
    static readonly GLOBAL_MANAGER: IOManager;
    scriptName: string;
    logTimestamp: boolean;
    timestampFormat: "ISO" | "UTC" | "Locale" | "Milliseconds" | "Human";
    isInIFrame: boolean;
    constructor(loggerOptions?: Partial<typeof IOManager["DEFAULT_LOGGER_OPTIONS"]>);
    getTimestamp(): string;
    joinPrefixes(prefixList: string[], addSpace?: boolean): string;
    getPrefix(includeTimestamp?: boolean, addSpace?: boolean): string;
    print(...messages: (string | any)[]): void;
    error(...errors: (string | any)[]): void;
    prompt(message: string, defaultText: string, includeTimestamp?: boolean): string | null;
    alert(message: string, includeTimestamp?: boolean): void;
}
