import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import { NFT } from '../../../../../types/core/chain/nft';
import { invokeGetCollection } from '../../../enevti_http_api/utils/hook/redeemable_nft_module';
import idBufferToNFT from '../../../enevti_http_api/utils/transformer/idBufferToNFT';

export function onNewNFTMinted(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newNFTMinted', async data => {
    if (data) {
      const payload = data as { collection: string; quantity: number };
      const collection = await invokeGetCollection(channel, payload.collection);
      if (!collection) throw new Error('undefined Collection id while subscribing newNFTMinted');
      const mintedNFT: NFT[] = await Promise.all(
        collection.minted.slice(0, payload.quantity).map(
          async (item): Promise<NFT> => {
            const nft = await idBufferToNFT(channel, item);
            if (!nft) throw new Error('undefined nft while iterating collection.minted');
            return nft;
          },
        ),
      );
      io.to(collection.id.toString()).emit(`newNFTMinted`, mintedNFT);
      io.to(collection.id.toString()).emit(`newTotalMinted`, collection.stat.minted);
    }
  });
}
