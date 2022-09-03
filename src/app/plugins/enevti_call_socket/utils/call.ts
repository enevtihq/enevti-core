import * as uuid from 'uuid';

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateCallId() {
  const callId = uuid.v4();
  return callId;
}
