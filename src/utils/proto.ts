// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function extend(this: any, sub: any): (...args: any[]) => void {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const Super = this;
  const Constructor = Object.prototype.hasOwnProperty.call(sub, 'constructor')
    ? sub.constructor
    : function(this: YumiSignResourceObject, ...args: any[]): void {
        Super.apply(this, args);
      };

  Object.assign(Constructor, Super);
  Constructor.prototype = Object.create(Super.prototype);
  Object.assign(Constructor.prototype, sub);

  return Constructor;
}
