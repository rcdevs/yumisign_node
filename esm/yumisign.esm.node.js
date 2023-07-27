import { NodePlatformFunctions } from './platforms/NodePlatformFunctions.js';
import { createYumiSign } from './yumisign.core.js';
export const YumiSign = createYumiSign(new NodePlatformFunctions());
export default YumiSign;
