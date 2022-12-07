import { BaseChannel } from 'lisk-framework';
import { Moment } from '../../../../../types/core/chain/moment';
import { invokeGetMomentAt } from '../invoker/redeemable_nft_module';
import idBufferToMoment from './idBufferToMoment';

export async function idBufferToMomentAt(channel: BaseChannel, id: Buffer) {
  const momentAt = await invokeGetMomentAt(channel, id.toString('hex'));
  const moment = await Promise.all(
    momentAt.moment.map(
      async (momentId): Promise<Moment> => {
        const momentData = await idBufferToMoment(channel, momentId);
        if (!momentData)
          throw new Error(`moment not found while iterating object ${id.toString('hex')}`);
        return momentData;
      },
    ),
  );
  return moment;
}
