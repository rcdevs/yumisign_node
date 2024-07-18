'use strict';

import {
  YumiSignAuthenticationError,
  YumiSignError,
  YumiSignPermissionError,
  YumiSignValidationError,
  YumiSignWebhookSignatureVerificationError,
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
          message: 'Unauthorized to perform this action',
          code: 'UNAUTHORIZED_TO_PERFORM_THIS_ACTION',
        })
      ).to.be.an.instanceOf(YumiSignPermissionError);
      expect(
        YumiSignError.generate({
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
        })
      ).to.be.an.instanceOf(YumiSignValidationError);
    });
  });

  it('Should set the default message', () => {
    const error = new YumiSignError();
    expect(error).to.have.property('message', 'Unknown error');
  });

  it('Should provide default type', () => {
    class FooError extends YumiSignError {}
    const error = new FooError({message: 'Error'});
    expect(error).to.have.property('type', 'YumiSignError');
  });

  it('Should respect type overriding by subclasses', () => {
    class FooError extends YumiSignError {
      constructor(raw: any) {
        super(raw, 'FooError');
      }
    }
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

  describe('YumiSignAuthenticationError', () => {
    it('Should create the correct instance', () => {
      const error = new YumiSignAuthenticationError();
      expect(error).to.be.an.instanceOf(YumiSignAuthenticationError);
      expect(error).to.have.property('message', 'Authentication error');
      expect(error).to.have.property('type', 'YumiSignAuthenticationError');
    });
  });

  describe('YumiSignPermissionError', () => {
    it('Should create the correct instance', () => {
      const error = new YumiSignPermissionError();
      expect(error).to.be.an.instanceOf(YumiSignPermissionError);
      expect(error).to.have.property('message', 'Permission error');
      expect(error).to.have.property('type', 'YumiSignPermissionError');
    });
  });

  describe('YumiSignValidationError', () => {
    it('Should create the correct instance', () => {
      const error = new YumiSignValidationError();
      expect(error).to.be.an.instanceOf(YumiSignValidationError);
      expect(error).to.have.property('message', 'Validation error');
      expect(error).to.have.property('type', 'YumiSignValidationError');
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

  describe('YumiSignWebhookSignatureVerificationError', () => {
    it('Should create the correct instance', () => {
      const header = 'header';
      const payload = 'payload';
      const error = new YumiSignWebhookSignatureVerificationError(
        header,
        payload
      );
      expect(error).to.be.an.instanceOf(
        YumiSignWebhookSignatureVerificationError
      );
      expect(error).to.have.property(
        'message',
        'Webhook signature verification error'
      );
      expect(error).to.have.property(
        'type',
        'YumiSignWebhookSignatureVerificationError'
      );
      expect(error).to.have.property('header', header);
      expect(error).to.have.property('payload', payload);
    });
  });
});
