"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodePlatformFunctions_js_1 = require("./platforms/NodePlatformFunctions.js");
const yumisign_core_js_1 = require("./yumisign.core.js");
const YumiSign = (0, yumisign_core_js_1.createYumiSign)(new NodePlatformFunctions_js_1.NodePlatformFunctions());
module.exports = YumiSign;
module.exports.YumiSign = YumiSign;
module.exports.default = YumiSign;
