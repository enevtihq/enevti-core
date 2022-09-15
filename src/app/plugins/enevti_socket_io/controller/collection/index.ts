import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import { NFT, NFTBase } from '../../../../../types/core/chain/nft';
import { invokeGetCollection } from '../../../enevti_http_api/utils/invoker/redeemable_nft_module';
import idBufferToNFT from '../../../enevti_http_api/utils/transformer/idBufferToNFT';
import { minimizeNFT } from '../../../enevti_http_api/utils/transformer/minimizeToBase';
import { delayEmit } from '../../utils/delayEmit';

export function onNewNFTMinted(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newNFTMinted', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { collection: string; quantity: number };
      const collection = await invokeGetCollection(channel, payload.collection);
      if (!collection) throw new Error('undefined Collection id while subscribing newNFTMinted');
      const mintedNFT: (NFTBase & { owner: NFT['owner'] })[] = await Promise.all(
        collection.minted.slice(0, payload.quantity).map(
          async (item): Promise<NFTBase & { owner: NFT['owner'] }> => {
            const nft = await idBufferToNFT(channel, item);
            if (!nft) throw new Error('undefined nft while iterating collection.minted');
            return { ...minimizeNFT(nft), owner: nft.owner };
          },
        ),
      );

      const mintedNFTMap = new Set<string>();
      mintedNFT.forEach(nft => mintedNFTMap.add(nft.owner.address));
      mintedNFTMap.forEach(address => io.to(address).emit('newProfileUpdates', Date.now()));

      io.to(collection.id.toString('hex')).emit(`newTotalMinted`, collection.stat.minted);
      io.to(collection.id.toString('hex')).emit(`newCollectionUpdates`, Date.now());
    }
  });
}

export function onNewCollectionLike(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newCollectionLike', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { id: string };
      const collection = await invokeGetCollection(channel, payload.id);
      if (!collection)
        throw new Error('undefined Collection id while subscribing newCollectionLike');

      io.to(collection.id.toString('hex')).emit(`newLike`, collection.like);
    }
  });
}

export function onNewCollectionComment(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newCollectionComment', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { id: string };
      const collection = await invokeGetCollection(channel, payload.id);
      if (!collection)
        throw new Error('undefined Collection id while subscribing newCollectionLike');

      io.to(collection.id.toString('hex')).emit(`newComment`, collection.comment);
    }
  });
}
