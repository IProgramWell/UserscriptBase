"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateForRegex = exports.onUrlChange = exports.callAllModulesMethod = exports.onModuleEvent = void 0;
function onModuleEvent(options) {
    var _a, _b, _c;
    let newIsActive;
    for (let module of options.moduleList) {
        try {
            if (module.isActive !== module.shouldBeActive((_a = options.currentLocation) !== null && _a !== void 0 ? _a : module.utils.urlUtils.getCurrentLocation())) {
                newIsActive = (_c = (_b = module.eventHandlers)[options.eventHandlerName]) === null || _c === void 0 ? void 0 : _c.call(_b, ...(options.handlerArgs));
                if (typeof newIsActive === "boolean" &&
                    newIsActive !== module.isActive) {
                    module.isActive = newIsActive;
                    options.logger.print((newIsActive
                        ? "Started"
                        : "Stopped") +
                        ` module: "${module.moduleName}"`);
                }
            }
        }
        catch (err) {
            options.logger.error(err, module);
        }
    }
}
exports.onModuleEvent = onModuleEvent;
;
function callAllModulesMethod(options) {
    var _a, _b, _c;
    for (let module of options.moduleList) {
        try {
            if (!options.onlyIfShouldBeActive ||
                module.shouldBeActive((_a = options.currentLocation) !== null && _a !== void 0 ? _a : module.utils.urlUtils.getCurrentLocation())) {
                (_c = (_b = module.methods) === null || _b === void 0 ? void 0 : _b[options.methodName]) === null || _c === void 0 ? void 0 : _c.call(_b, ...options.methodArgs);
            }
        }
        catch (err) {
            options.logger.error({
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
    var _a, _b, _c;
    for (let module of options.moduleList) {
        try {
            if (module.shouldBeActive((_a = options.currentLocation) !== null && _a !== void 0 ? _a : module.utils.urlUtils.getCurrentLocation())) {
                if (!module.isActive && module.eventHandlers.onModuleStart) {
                    module.isActive = module.eventHandlers.onModuleStart();
                    (_b = options.logger) === null || _b === void 0 ? void 0 : _b.print(`Started module: "${module.moduleName}"`);
                }
            }
            else if (module.isActive && module.eventHandlers.onModuleStop) {
                module.isActive = module.eventHandlers.onModuleStop();
                (_c = options.logger) === null || _c === void 0 ? void 0 : _c.print(`Stopped module: "${module.moduleName}"`);
            }
        }
        catch (err) {
            options.logger.error(err, module);
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
