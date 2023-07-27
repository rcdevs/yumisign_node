import {PlatformFunctions} from './platforms/PlatformFunctions.js';
import {createYumiSign} from './yumisign.core.js';

const YumiSign = createYumiSign(new PlatformFunctions());

module.exports = YumiSign;
module.exports.YumiSign = YumiSign;
module.exports.default = YumiSign;
