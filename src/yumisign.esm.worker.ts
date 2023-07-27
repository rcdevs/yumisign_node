import {PlatformFunctions} from './platforms/PlatformFunctions.js';
import {createYumiSign} from './yumisign.core.js';

export const YumiSign = createYumiSign(new PlatformFunctions());
export default YumiSign;
