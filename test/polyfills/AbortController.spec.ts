'use strict';

import {
  AbortController,
  AbortSignal,
} from '../../src/polyfills/AbortController.js';
import {expect} from 'chai';

describe('AbortController', () => {
  it('Should create an instance of AbortController', () => {
    const controller = new AbortController();
    expect(controller).to.be.an.instanceof(AbortController);
    expect(controller.signal).to.be.an.instanceof(AbortSignal);
  });

  it('Should set the signal as aborted when abort is called', () => {
    const controller = new AbortController();
    expect(controller.signal.aborted).to.be.false;
    controller.abort();
    expect(controller.signal.aborted).to.be.true;
  });

  it('Should trigger onabort event when abort is called', (done) => {
    const controller = new AbortController();
    controller.signal.onabort = () => {
      expect(controller.signal.aborted).to.be.true;
      done();
    };
    controller.abort();
  });

  it('Should call the abort event listener when abort is called', (done) => {
    const controller = new AbortController();
    controller.signal.addEventListener('abort', () => {
      expect(controller.signal.aborted).to.be.true;
      done();
    });
    controller.abort();
  });

  it('Should not call removed abort event listener when abort is called', () => {
    const controller = new AbortController();
    const abortListener = () => {
      throw new Error('This should not be called');
    };
    controller.signal.addEventListener('abort', abortListener);
    controller.signal.removeEventListener('abort', abortListener);
    controller.abort();
  });
});
