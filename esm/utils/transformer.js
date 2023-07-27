export function transformEnvelope(envelope) {
    const creator = 'creator' in envelope ? envelope.creator : envelope.workflowCreator;
    return Object.assign(Object.assign({}, envelope), { creator });
}
export function transformAction(action) {
    const envelope = 'envelope' in action ? action.envelope : action.workflow;
    return Object.assign(Object.assign({}, action), { envelope: transformEnvelope(envelope) });
}
