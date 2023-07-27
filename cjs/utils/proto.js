"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = void 0;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function extend(sub) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const Super = this;
    const Constructor = Object.prototype.hasOwnProperty.call(sub, 'constructor')
        ? sub.constructor
        : function (...args) {
            Super.apply(this, args);
        };
    Object.assign(Constructor, Super);
    Constructor.prototype = Object.create(Super.prototype);
    Object.assign(Constructor.prototype, sub);
    return Constructor;
}
exports.extend = extend;
