import YumiSign from 'yumisign';

interface ApiWorkflow extends YumiSign.Envelope {}

interface ApiArchive extends Omit<YumiSign.Envelope, 'creator'> {
  workflowCreator: YumiSign.Profile;
}

interface ApiAction extends Omit<YumiSign.Action, 'envelope'> {
  workflow: ApiWorkflow;
}

export function transformEnvelope<
  T extends
    | YumiSign.Response<YumiSign.Envelope | ApiWorkflow | ApiArchive>
    | YumiSign.Envelope
    | ApiWorkflow
    | ApiArchive
>(envelope: T): T {
  const creator =
    'creator' in envelope ? envelope.creator : envelope.workflowCreator;
  return {...envelope, creator};
}

export function transformAction<
  T extends
    | YumiSign.Response<YumiSign.Action | ApiAction>
    | YumiSign.Action
    | ApiAction
>(action: T): T {
  const envelope = 'envelope' in action ? action.envelope : action.workflow;
  return {...action, envelope: transformEnvelope(envelope)};
}
