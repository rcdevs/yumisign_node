import {NodePlatformFunctions} from './platforms/NodePlatformFunctions.js';
import {createYumiSign} from './yumisign.core.js';

const YumiSign = createYumiSign(new NodePlatformFunctions());

module.exports = YumiSign;
module.exports.YumiSign = YumiSign;
module.exports.default = YumiSign;
