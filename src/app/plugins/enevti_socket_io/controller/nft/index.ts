import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import { invokeGetNFT } from '../../../enevti_http_api/utils/invoker/redeemable_nft_module';
import { delayEmit } from '../../utils/delayEmit';

export function onNewNFTLike(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newNFTLike', async data => {
    if (data) {
      await delayEmit();
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
      await delayEmit();
      const payload = data as { id: string };
      const nft = await invokeGetNFT(channel, payload.id);
      if (!nft) throw new Error('undefined NFT id while subscribing newNFTLike');

      io.to(nft.id.toString('hex')).emit(`newComment`, nft.comment);
    }
  });
}

export function onVideoCallStatusChanged(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:videoCallStatusChanged', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { id: string; status: string };
      const nft = await invokeGetNFT(channel, payload.id);
      if (!nft) throw new Error('undefined NFT id while subscribing videoCallStatusChanged');

      io.to(nft.id.toString('hex')).emit(`videoCallStatusChanged`, payload.status);
    }
  });
}
