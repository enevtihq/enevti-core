import { EMIT_DELAY } from '../constant/delay';

export async function delayEmit() {
  await new Promise(res => setTimeout(() => res(true), EMIT_DELAY));
}
