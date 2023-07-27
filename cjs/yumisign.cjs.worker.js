"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlatformFunctions_js_1 = __importDefault(require("./platforms/PlatformFunctions.js"));
const yumisign_core_js_1 = __importDefault(require("./yumisign.core.js"));
const YumiSign = (0, yumisign_core_js_1.default)(new PlatformFunctions_js_1.default());
module.exports = YumiSign;
module.exports.YumiSign = YumiSign;
module.exports.default = YumiSign;
