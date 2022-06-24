import { BaseChannel } from 'lisk-framework';
import addressBufferToPersona from './addressBufferToPersona';
import { invokeGetActivityProfile } from '../hook/redeemable_nft_module';
import chainDateToUI from './chainDateToUI';
import { ProfileActivity } from '../../../../../types/core/account/profile';
import idBufferToNFT from './idBufferToNFT';
import idBufferToCollection from './idBufferToCollection';
import { NFT } from '../../../../../types/core/chain/nft';
import { Collection } from '../../../../../types/core/chain/collection';

export default async function idBufferToActivityProfile(channel: BaseChannel, address: Buffer) {
  const activityChain = await invokeGetActivityProfile(channel, address.toString('hex'));
  const activity: ProfileActivity[] = await Promise.all(
    activityChain.items.map(async act => {
      const transaction = act.transaction.toString('hex');
      const from = await addressBufferToPersona(channel, act.from);
      const to = await addressBufferToPersona(channel, act.to);
      const value = {
        amount: act.value.amount.toString(),
        currency: act.value.currency,
      };

      let payload: NFT | Collection | Record<string, unknown> | undefined = {};
      switch (act.name) {
        case 'mintNFT':
        case 'deliverSecret':
        case 'NFTSale':
          payload = await idBufferToNFT(channel, act.payload);
          break;
        case 'createNFT':
          payload = await idBufferToCollection(channel, act.payload);
          break;
        default:
          break;
      }

      return { ...act, date: chainDateToUI(act.date), transaction, from, to, value, payload };
    }),
  );
  return activity;
}
