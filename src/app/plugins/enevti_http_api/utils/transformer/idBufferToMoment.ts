import { BaseChannel } from 'lisk-framework';
import { Moment } from '../../../../../types/core/chain/moment';
import { invokeGetMoment } from '../invoker/redeemable_nft_module';
import addressBufferToPersona from './addressBufferToPersona';
import chainDateToUI from './chainDateToUI';

export default async function idBufferToMoment(
  channel: BaseChannel,
  id: Buffer,
): Promise<Moment | undefined> {
  const moment = await invokeGetMoment(channel, id.toString('hex'));
  if (!moment) return undefined;
  return {
    ...moment,
    id: moment.id.toString('hex'),
    nftId: moment.nftId.toString('hex'),
    owner: await addressBufferToPersona(channel, moment.owner),
    creator: await addressBufferToPersona(channel, moment.creator),
    createdOn: chainDateToUI(moment.createdOn),
  };
}
