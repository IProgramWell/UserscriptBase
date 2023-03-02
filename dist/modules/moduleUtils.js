"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateForRegex = exports.onUrlChange = exports.callAllModulesMethod = exports.onModuleEvent = void 0;
const IOManager_1 = __importDefault(require("../utils/IOManager"));
function onModuleEvent(options) {
    var _a, _b, _c, _d;
    let newIsActive;
    let logger = (_a = options.logger) !== null && _a !== void 0 ? _a : IOManager_1.default.GLOBAL_MANAGER;
    for (let module of options.moduleList) {
        try {
            if (!options.onlyIfShouldBeActive ||
                module.isActive !== module.shouldBeActive((_b = options.currentLocation) !== null && _b !== void 0 ? _b : module.utils.urlUtils.getCurrentLocation())) {
                newIsActive = (_d = (_c = module.eventHandlers)[options.eventHandlerName]) === null || _d === void 0 ? void 0 : _d.call(_c);
                if (typeof newIsActive === "boolean" &&
                    newIsActive !== module.isActive) {
                    module.isActive = newIsActive;
                    logger.print(`${(newIsActive
                        ? "Started"
                        : "Stopped")} module: "${module.moduleName}"`);
                }
            }
        }
        catch (err) {
            logger.error(err, module);
        }
    }
}
exports.onModuleEvent = onModuleEvent;
;
function callAllModulesMethod(options) {
    var _a, _b, _c, _d;
    let logger = (_a = options.logger) !== null && _a !== void 0 ? _a : IOManager_1.default.GLOBAL_MANAGER;
    for (let module of options.moduleList) {
        try {
            if (!options.onlyIfShouldBeActive ||
                module.shouldBeActive((_b = options.currentLocation) !== null && _b !== void 0 ? _b : module.utils.urlUtils.getCurrentLocation())) {
                (_d = (_c = module.methods) === null || _c === void 0 ? void 0 : _c[options.methodName]) === null || _d === void 0 ? void 0 : _d.call(_c, ...options.methodArgs);
            }
        }
        catch (err) {
            logger.error({
                err,
                module,
                methodName: options.methodName,
                methodArgs: options.methodArgs,
            });
        }
    }
}
exports.callAllModulesMethod = callAllModulesMethod;
function onUrlChange(options) {
    var _a, _b;
    let logger = (_a = options.logger) !== null && _a !== void 0 ? _a : IOManager_1.default.GLOBAL_MANAGER;
    for (let module of options.moduleList) {
        try {
            if (module.shouldBeActive((_b = options.currentLocation) !== null && _b !== void 0 ? _b : module.utils.urlUtils.getCurrentLocation())) {
                if (!module.isActive && module.eventHandlers.onModuleStart) {
                    module.isActive = module.eventHandlers.onModuleStart();
                    logger.print(`Started module: "${module.moduleName}"`);
                }
            }
            else if (module.isActive && module.eventHandlers.onModuleStop) {
                module.isActive = module.eventHandlers.onModuleStop();
                logger.print(`Stopped module: "${module.moduleName}"`);
            }
        }
        catch (err) {
            logger.error(err, module);
        }
    }
}
exports.onUrlChange = onUrlChange;
function activateForRegex(regex, wholeUrl = false) {
    const ACTIVATE_REGEXP = typeof regex === "string"
        ? new RegExp(regex)
        : regex;
    return function (url) {
        const TEST_URL = url
            ? (typeof url === "string"
                ? new URL(url)
                : url)
            : this.utils.urlUtils.getCurrentLocation();
        return ACTIVATE_REGEXP.test(wholeUrl
            ? TEST_URL.href
            : TEST_URL.pathname);
    };
}
exports.activateForRegex = activateForRegex;
