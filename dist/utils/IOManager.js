"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjUtils_1 = require("./ObjUtils");
const PageUtils_1 = require("./PageUtils");
class IOManager {
    constructor(loggerOptions = IOManager.DEFAULT_LOGGER_OPTIONS) {
        var _a;
        this.isInIFrame = false;
        const options = Object.assign(Object.assign({}, IOManager.DEFAULT_LOGGER_OPTIONS), loggerOptions);
        (0, ObjUtils_1.bindMethods)({ source: this });
        this.scriptName = options.name;
        this.logTimestamp = options.logTimestamp;
        this.timestampFormat = options.timestampFormat;
        this.isInIFrame = (_a = options.isInIFrame) !== null && _a !== void 0 ? _a : false;
    }
    getTimestamp() {
        switch (this.timestampFormat) {
            case "UTC":
                return new Date().toUTCString();
            case "ISO":
                return new Date().toISOString();
            case "Locale":
                return new Date().toLocaleString();
            case "Milliseconds":
                return new Date().getTime().toString();
            case "Human":
            default:
                return new Date().toString();
        }
    }
    getPrefix(includeTimestamp = false, addSpace = false) {
        return [
            includeTimestamp && this.getTimestamp(),
            this.isInIFrame && IOManager.IFRAME_LOG_PREFIX,
            this.scriptName,
        ]
            .reduce(function (prefixes, prfx) {
            if (prfx)
                prefixes.push(`[${prfx}]`);
            return prefixes;
        }, [])
            .join(" ") + ":" + (addSpace ? " " : "");
    }
    print(...messages) {
        console.log(this.getPrefix(this.logTimestamp, false), ...messages);
    }
    error(...errors) {
        console.error(this.getPrefix(this.logTimestamp, false), ...errors);
    }
}
exports.default = IOManager;
IOManager.IFRAME_LOG_PREFIX = "iframe";
IOManager.DEFAULT_LOGGER_OPTIONS = {
    name: globalThis.GM_info
        ? `${GM_info.script.name} v${GM_info.script.version}`
        : "",
    logTimestamp: true,
    timestampFormat: "Locale",
    isInIFrame: (0, PageUtils_1.isScriptInIFrame)(),
};
IOManager.GLOBAL_MANAGER = new IOManager();
