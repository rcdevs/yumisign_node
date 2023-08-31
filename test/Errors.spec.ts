'use strict';

import {
  YumiSignAuthenticationError,
  YumiSignError,
  YumiSignValidationError,
} from '../src/Errors.js';
import {expect} from 'chai';

describe('Errors', () => {
  describe('YumiSignError', () => {
    it('Generates specific instance depending on error code', () => {
      expect(
        YumiSignError.generate({
          message: 'Authentication required',
          code: 'AUTHENTICATION_REQUIRED',
        })
      ).to.be.an.instanceOf(YumiSignAuthenticationError);
      expect(
        YumiSignError.generate({
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
        })
      ).to.be.an.instanceOf(YumiSignValidationError);
    });
  });

  it('Should provide type as their name', () => {
    class FooError extends YumiSignError {}
    const error = new FooError({message: 'Error'});
    expect(error).to.have.property('type', 'FooError');
  });

  it('Should provide the http status code', () => {
    const error = YumiSignError.generate({
      message: 'Error',
      statusCode: 400,
    });
    expect(error).to.have.property('statusCode', 400);
  });

  it('Should provide validation violations', () => {
    const violations = {foo: 'bar'};
    const error = new YumiSignValidationError({
      message: 'Validation error',
      violations,
    });
    expect(error).to.have.property('violations', violations);
  });
});
