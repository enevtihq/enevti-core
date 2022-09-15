import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import { delayEmit } from '../../utils/delayEmit';

export function onNewActivityCollection(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newActivityCollection', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { collection: string; timestamp: number };
      io.to(payload.collection).emit(`newCollectionUpdates`, Date.now());
    }
  });
}

export function onNewActivityNFT(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newActivityNFT', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { nft: string; timestamp: number };
      io.to(payload.nft).emit(`newNFTUpdates`, Date.now());
    }
  });
}

export function onNewActivityProfile(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newActivityProfile', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { address: string; timestamp: number };
      io.to(payload.address).emit(`newProfileActivityUpdates`, Date.now());
    }
  });
}
