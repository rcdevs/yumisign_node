import {WebPlatformFunctions} from './platforms/WebPlatformFunctions.js';
import {createYumiSign} from './yumisign.core.js';

export const YumiSign = createYumiSign(new WebPlatformFunctions());
export default YumiSign;
