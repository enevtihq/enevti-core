import { BaseChannel } from 'lisk-framework';
import { NFTActivity } from '../../../../types/core/chain/nft/NFTActivity';
import addressBufferToPersona from './addressBufferToPersona';
import { invokeGetActivityNFT } from './hook/redeemable_nft_module';

export default async function idBufferToActivityNFT(channel: BaseChannel, id: Buffer) {
  const activityChain = await invokeGetActivityNFT(channel, id.toString('hex'));
  const activity: NFTActivity[] = await Promise.all(
    activityChain.items.map(async act => {
      const transaction = act.transaction.toString('hex');
      const to = await addressBufferToPersona(channel, act.to);
      const value = {
        amount: act.value.amount.toString(),
        currency: act.value.currency,
      };
      return { ...act, transaction, to, value };
    }),
  );
  return activity;
}
