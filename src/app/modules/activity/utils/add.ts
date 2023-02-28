import { AddActivityPayload } from 'enevti-types/param/activity';
import { cryptography, codec, StateStore } from 'lisk-sdk';
import { diff, jsonPatchPathConverter } from 'just-diff';
import { activityItemSchema } from '../schema/item';
import { setActivityGenesis } from './genesis';
import { setActivity } from './item';
import { getActivities, setActivities } from './list';

// eslint-disable-next-line import/order
import variableDiff = require('variable-diff');

export const diffOptions = { color: false };

export const addActivity = async (
  stateStore: StateStore,
  oldState: Record<string, unknown>,
  newState: Record<string, unknown>,
  addActivityPayload: AddActivityPayload,
) => {
  const identifier = addActivityPayload.key.split(':')[0];
  const key = addActivityPayload.key.split(':')[1];
  const transaction = addActivityPayload.transaction ?? Buffer.alloc(0);
  const payload = addActivityPayload.payload ?? Buffer.alloc(0);

  let previousActivityId: Buffer = Buffer.alloc(0);
  const activities = (await getActivities(stateStore, identifier, key)) ?? { items: [] };
  if (activities.items.length > 0) {
    [previousActivityId] = activities.items;
  } else {
    await setActivityGenesis(stateStore, identifier, key, { state: JSON.stringify(oldState) });
  }

  const activityDiff = variableDiff(oldState, newState, diffOptions);
  const activityPatch = diff(oldState, newState, jsonPatchPathConverter).map(p =>
    JSON.stringify(p),
  );
  const compiledActivity = {
    ...addActivityPayload,
    previousActivityId,
    diff: activityDiff.text,
    patch: activityPatch,
    height: stateStore.chain.lastBlockHeaders[0].height + 1,
    transaction,
    payload,
  };
  const id = cryptography.hash(codec.encode(activityItemSchema, compiledActivity));
  activities.items.unshift(id);

  await setActivity(stateStore, id, compiledActivity);
  await setActivities(stateStore, identifier, key, activities);

  if (compiledActivity.transaction.length > 0) {
    const transactionActivities = (await getActivities(
      stateStore,
      'transaction',
      compiledActivity.transaction.toString('hex'),
    )) ?? { items: [] };
    transactionActivities.items.unshift(id);
    await setActivities(
      stateStore,
      'transaction',
      compiledActivity.transaction.toString('hex'),
      transactionActivities,
    );
  }

  if (compiledActivity.height > 0) {
    const blockActivities = (await getActivities(
      stateStore,
      'block',
      compiledActivity.height.toString(),
    )) ?? { items: [] };
    blockActivities.items.unshift(id);
    await setActivities(stateStore, 'block', compiledActivity.height.toString(), blockActivities);
  }
};
