import YumiSign from 'yumisign';

interface ApiWorkflow extends YumiSign.Envelope {
  envelopeId?: string;
}

interface ApiArchive extends Omit<YumiSign.Envelope, 'creator'> {
  workflowCreator: YumiSign.Profile;
}

interface ApiAction extends Omit<YumiSign.Action, 'envelope'> {
  workflow: ApiWorkflow;
}

interface ApiTemplate
  extends Omit<YumiSign.Template, 'recipientsCount' | 'recipients'> {
  recipientsCount?: number;
  recipients?: any[];
}

export function toEnvelope<
  T extends
    | YumiSign.Response<YumiSign.Envelope | ApiWorkflow | ApiArchive>
    | YumiSign.Envelope
    | ApiWorkflow
    | ApiArchive
>(envelope: T): T {
  const id = 'envelopeId' in envelope ? envelope.envelopeId : envelope.id;
  const creator =
    'creator' in envelope ? envelope.creator : envelope.workflowCreator;
  return {...envelope, id, creator};
}

export function toAction<
  T extends
    | YumiSign.Response<YumiSign.Action | ApiAction>
    | YumiSign.Action
    | ApiAction
>(action: T): T {
  const envelope = 'envelope' in action ? action.envelope : action.workflow;
  return {...action, envelope: toEnvelope(envelope)};
}

export function toTemplate<
  T extends
    | YumiSign.Response<YumiSign.Template | ApiTemplate>
    | YumiSign.Template
    | ApiTemplate
>(template: T): T {
  const recipientsCount =
    ('recipients' in template
      ? template.recipients?.length
      : template.recipientsCount) ?? 0;
  return {...template, recipientsCount};
}
