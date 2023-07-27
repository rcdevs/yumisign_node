import { NodeCryptoHelper } from '../crypto/NodeCryptoHelper.js';
import { PlatformFunctions } from './PlatformFunctions.js';
export class NodePlatformFunctions extends PlatformFunctions {
    createCryptoHelper() {
        return new NodeCryptoHelper();
    }
}
