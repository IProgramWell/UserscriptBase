import type { ILogger } from "../../types/Interfaces";
import type { IOManagerOptions, TimeStampFormat } from "types/UtilityTypes";
export default class IOManager implements ILogger {
    static readonly IFRAME_LOG_PREFIX: string;
    static readonly DEFAULT_LOGGER_OPTIONS: IOManagerOptions;
    static readonly GLOBAL_MANAGER: IOManager;
    scriptName: string;
    logTimestamp: boolean;
    timestampFormat: TimeStampFormat;
    isInIFrame: boolean;
    constructor(loggerOptions?: Partial<IOManagerOptions>);
    getTimestamp(): string;
    getPrefix(includeTimestamp?: boolean, addSpace?: boolean): string;
    print(...messages: (string | any)[]): void;
    error(...errors: (string | any)[]): void;
}
