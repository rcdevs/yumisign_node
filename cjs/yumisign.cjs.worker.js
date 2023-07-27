"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlatformFunctions_js_1 = require("./platforms/PlatformFunctions.js");
const yumisign_core_js_1 = require("./yumisign.core.js");
const YumiSign = (0, yumisign_core_js_1.createYumiSign)(new PlatformFunctions_js_1.PlatformFunctions());
module.exports = YumiSign;
module.exports.YumiSign = YumiSign;
module.exports.default = YumiSign;
