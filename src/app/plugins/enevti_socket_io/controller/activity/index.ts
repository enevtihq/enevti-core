import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import { CollectionActivity } from '../../../../../types/core/chain/collection';
import { NFTActivity } from '../../../../../types/core/chain/nft/NFTActivity';
import {
  invokeGetActivityCollection,
  invokeGetActivityNFT,
  invokeGetCollection,
  invokeGetNFT,
} from '../../../enevti_http_api/utils/hook/redeemable_nft_module';
import addressBufferToPersona from '../../../enevti_http_api/utils/transformer/addressBufferToPersona';
import idBufferToNFT from '../../../enevti_http_api/utils/transformer/idBufferToNFT';

export function onNewActivityCollection(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newActivityCollection', async data => {
    if (data) {
      const payload = data as { collection: string; timestamp: number };
      const collection = await invokeGetCollection(channel, payload.collection);
      if (!collection)
        throw new Error('undefined Collection id while subscribing newActivityCollection');
      const timestampMark = BigInt(payload.timestamp);
      const collectionActivity = await invokeGetActivityCollection(channel, payload.collection);
      const ret: CollectionActivity[] = await Promise.all(
        collectionActivity.items
          .filter(activity => activity.date === timestampMark)
          .map(async activity => {
            const to = await addressBufferToPersona(channel, activity.to);
            const nfts = await Promise.all(
              activity.nfts.map(async item => {
                const nft = await idBufferToNFT(channel, item);
                if (!nft) throw new Error('nft undefined in newActivityCollection event');
                return nft;
              }),
            );
            return {
              ...activity,
              transaction: activity.transaction.toString('hex'),
              date: Number(activity.date),
              value: {
                amount: activity.value.amount.toString(),
                currency: activity.value.currency,
              },
              to,
              nfts,
            };
          }),
      );
      io.to(collection.id.toString()).emit(`newActivity`, ret);
    }
  });
}

export function onNewActivityNFT(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newActivityNFT', async data => {
    if (data) {
      const payload = data as { nft: string; timestamp: number };
      const nft = await invokeGetNFT(channel, payload.nft);
      if (!nft) throw new Error('undefined nft id while subscribing newActivityNFT');
      const timestampMark = BigInt(payload.timestamp);
      const nftActivity = await invokeGetActivityNFT(channel, payload.nft);
      const ret: NFTActivity[] = await Promise.all(
        nftActivity.items
          .filter(activity => activity.date === timestampMark)
          .map(async activity => {
            const to = await addressBufferToPersona(channel, activity.to);
            return {
              ...activity,
              transaction: activity.transaction.toString('hex'),
              date: Number(activity.date),
              value: {
                amount: activity.value.amount.toString(),
                currency: activity.value.currency,
              },
              to,
            };
          }),
      );
      io.to(nft.id.toString()).emit(`newActivity`, ret);
    }
  });
}
