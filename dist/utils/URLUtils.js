"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentLocation = exports.openNewTab = exports.setLocationAttribute = exports.navigate = void 0;
function navigate(NewURL) {
    document.location.assign(NewURL.toString());
}
exports.navigate = navigate;
function setLocationAttribute(AttrName, AttrValue) {
    document.location[AttrName] = AttrValue;
}
exports.setLocationAttribute = setLocationAttribute;
function openNewTab(URL) {
    if (globalThis.GM_openInTab)
        GM_openInTab(URL.toString());
    else
        globalThis.open(URL.toString(), "_blank");
}
exports.openNewTab = openNewTab;
function getCurrentLocation() {
    return document.location;
}
exports.getCurrentLocation = getCurrentLocation;
