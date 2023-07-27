import CryptoHelper from './CryptoHelper.js';
import {createHmac} from 'crypto';

export default class NodeCryptoHelper extends CryptoHelper {
  computeHmacSignature(payload: string, secret: string): string {
    return createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');
  }
}
