import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import { invokeGetNFT } from '../../../enevti_http_api/utils/hook/redeemable_nft_module';

export function onNewNFTLike(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newNFTLike', async data => {
    if (data) {
      const payload = data as { id: string };
      const nft = await invokeGetNFT(channel, payload.id);
      if (!nft) throw new Error('undefined NFT id while subscribing newNFTLike');

      io.to(nft.id.toString('hex')).emit(`newLike`, nft.like);
    }
  });
}

export function onNewNFTComment(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newNFTComment', async data => {
    if (data) {
      const payload = data as { id: string };
      const nft = await invokeGetNFT(channel, payload.id);
      if (!nft) throw new Error('undefined NFT id while subscribing newNFTLike');

      io.to(nft.id.toString('hex')).emit(`newComment`, nft.comment);
    }
  });
}
