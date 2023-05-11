"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformAction = exports.transformEnvelope = void 0;
function transformEnvelope(envelope) {
    const creator = 'creator' in envelope ? envelope.creator : envelope.workflowCreator;
    return Object.assign(Object.assign({}, envelope), { creator });
}
exports.transformEnvelope = transformEnvelope;
function transformAction(action) {
    const envelope = 'envelope' in action ? action.envelope : action.workflow;
    return Object.assign(Object.assign({}, action), { envelope: transformEnvelope(envelope) });
}
exports.transformAction = transformAction;
