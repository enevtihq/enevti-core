import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import {
  invokeGetActivityCollection,
  invokeGetActivityNFT,
  invokeGetCollection,
  invokeGetNFT,
} from '../../../enevti_http_api/utils/hook/redeemable_nft_module';

export function onNewActivityCollection(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newActivityCollection', async data => {
    if (data) {
      const payload = data as { collection: string; timestamp: number };
      const collection = await invokeGetCollection(channel, payload.collection);
      if (!collection)
        throw new Error('undefined Collection id while subscribing newActivityCollection');
      const timestampMark = BigInt(payload.timestamp);
      const collectionActivity = await invokeGetActivityCollection(channel, payload.collection);
      const ret = collectionActivity.items.filter(activity => activity.date === timestampMark);
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
      const ret = nftActivity.items.filter(activity => activity.date === timestampMark);
      io.to(nft.id.toString()).emit(`newActivity`, ret);
    }
  });
}
