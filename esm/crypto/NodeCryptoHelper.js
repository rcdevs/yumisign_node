import CryptoHelper from './CryptoHelper.js';
import { createHmac } from 'crypto';
export default class NodeCryptoHelper extends CryptoHelper {
    computeHmacSignature(payload, secret) {
        return createHmac('sha256', secret)
            .update(payload, 'utf8')
            .digest('hex');
    }
}
