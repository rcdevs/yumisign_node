import {WebPlatformFunctions} from './platforms/WebPlatformFunctions.js';
import {createYumiSign} from './yumisign.core.js';

const YumiSign = createYumiSign(new WebPlatformFunctions());

module.exports = YumiSign;
module.exports.YumiSign = YumiSign;
module.exports.default = YumiSign;
