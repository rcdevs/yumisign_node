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

export function transformEnvelope<
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

export function transformAction<
  T extends
    | YumiSign.Response<YumiSign.Action | ApiAction>
    | YumiSign.Action
    | ApiAction
>(action: T): T {
  const envelope = 'envelope' in action ? action.envelope : action.workflow;
  return {...action, envelope: transformEnvelope(envelope)};
}

export function transformTemplate<
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
