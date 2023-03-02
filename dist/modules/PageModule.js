"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageModule = void 0;
const ObjUtils_1 = require("../utils/ObjUtils");
const IOManager_1 = __importDefault(require("../utils/IOManager"));
const urlUtils = __importStar(require("../utils/URLUtils"));
const pageUtils = __importStar(require("../utils/PageUtils"));
class PageModule {
    constructor(moduleDetails) {
        var _a, _b;
        /**
         * A collection of per module event handlers,
         * bound to the current module instance.
         *
         * All event handlers should return a boolean value
         * indicating whether the current module is active or not.
         *
         */
        this.eventHandlers = {};
        this.methods = {};
        this.shouldBeActive = function () {
            return true;
        };
        this.moduleName = null;
        this.logger = IOManager_1.default.GLOBAL_MANAGER;
        this.utils = { urlUtils, pageUtils, };
        this.state = new Map();
        this.isActive = false;
        (0, ObjUtils_1.bindMethods)({ source: this });
        if (moduleDetails.shouldBeActive)
            this.shouldBeActive = moduleDetails.shouldBeActive.bind(this);
        for (let [methodName, methodFunc] of Object.entries((_a = moduleDetails.eventHandlers) !== null && _a !== void 0 ? _a : {}))
            if (typeof methodFunc === "function")
                this.eventHandlers[methodName] = methodFunc.bind(this);
        for (let [methodName, methodFunc] of Object.entries((_b = moduleDetails.methods) !== null && _b !== void 0 ? _b : {}))
            if (typeof methodFunc === "function")
                this.methods[methodName] = methodFunc.bind(this);
        if (moduleDetails.logger)
            this.logger = moduleDetails.logger;
        if (moduleDetails.moduleName)
            this.moduleName = moduleDetails.moduleName;
        if (moduleDetails.utils)
            this.utils = moduleDetails.utils;
    }
    getStateValue(name, defaultValue = null) {
        var _a;
        return (_a = this.state.get(name)) !== null && _a !== void 0 ? _a : defaultValue;
    }
    setStateValue(name, value) {
        this.state.set(name, value);
    }
}
exports.PageModule = PageModule;
exports.default = PageModule;
