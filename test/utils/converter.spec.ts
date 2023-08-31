'use strict';

import {toAction, toEnvelope, toTemplate} from '../../src/utils/converter.js';
import YumiSign from 'yumisign';
import {expect} from 'chai';

describe('Converter', () => {
  describe('toEnvelope', () => {
    const envelope: YumiSign.Envelope = {
      id: 'env_1',
      name: 'name',
      type: 'simple',
      status: 'not_started',
      createDate: undefined,
      expiryDate: 1,
      workspaceId: undefined,
      creator: undefined,
      documents: [],
      metadata: {},
    };

    it('Should return an envelope from an envelope', () => {
      expect(toEnvelope(envelope)).to.deep.equal(envelope);
    });

    it('Should return an envelope from an api workflow', () => {
      const {id, ...rest} = envelope;
      const apiWorkflow = {envelopeId: id, ...rest};
      // @ts-ignore
      expect(toEnvelope(apiWorkflow)).to.deep.equal({
        ...envelope,
        envelopeId: id,
      });
    });

    it('Should return an envelope from an api archive', () => {
      const {creator, ...rest} = envelope;
      const apiArchive = {workflowCreator: creator, ...rest};
      // @ts-ignore
      expect(toEnvelope(apiArchive)).to.deep.equal({
        ...envelope,
        workflowCreator: creator,
      });
    });
  });

  describe('toAction', () => {
    const action: YumiSign.Action = {
      id: 1,
      type: 'sign',
      status: 'not_started',
      envelope: {
        id: 'env_1',
        name: 'name',
        type: 'simple',
        status: 'not_started',
        createDate: undefined,
        expiryDate: 1,
        workspaceId: undefined,
        creator: undefined,
        documents: [],
        metadata: {},
      },
      publicSignUri: undefined,
    };

    it('Should return an action from an action', () => {
      expect(toAction(action)).to.deep.equal(action);
    });

    it('Should return an action from an api action', () => {
      const {envelope, ...rest} = action;
      const apiAction = {workflow: envelope, ...rest};
      expect(toAction(apiAction)).to.deep.equal({
        ...action,
        workflow: envelope,
      });
    });
  });

  describe('toTemplate', () => {
    const template: YumiSign.Template = {
      id: 1,
      name: 'name',
      type: 'simple',
      recipientsCount: 1,
      createDate: undefined,
    };

    it('Should return an template from an template', () => {
      expect(toTemplate(template)).to.deep.equal(template);
    });

    it('Should return an template from an api template', () => {
      const {recipientsCount, ...rest} = template;
      const apiTemplate = {recipients: [{id: 1, name: 'name'}], ...rest};
      expect(toTemplate(apiTemplate)).to.deep.equal({
        ...template,
        recipients: [{id: 1, name: 'name'}],
      });
    });
  });
});
