import {CryptoHelper} from '../crypto/CryptoHelper.js';
import {NodeCryptoHelper} from '../crypto/NodeCryptoHelper.js';
import {PlatformFunctions} from './PlatformFunctions.js';

export class NodePlatformFunctions extends PlatformFunctions {
  createCryptoHelper(): CryptoHelper {
    return new NodeCryptoHelper();
  }
}
