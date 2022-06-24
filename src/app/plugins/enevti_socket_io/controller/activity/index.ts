import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';

export function onNewActivityCollection(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newActivityCollection', data => {
    if (data) {
      const payload = data as { collection: string; timestamp: number };
      io.to(payload.collection).emit(`newCollectionUpdates`, Date.now());
    }
  });
}

export function onNewActivityNFT(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newActivityNFT', data => {
    if (data) {
      const payload = data as { nft: string; timestamp: number };
      io.to(payload.nft).emit(`newNFTUpdates`, Date.now());
    }
  });
}

export function onNewActivityProfile(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newActivityProfile', data => {
    if (data) {
      const payload = data as { address: string; timestamp: number };
      io.to(payload.address).emit(`newProfileActivityUpdates`, Date.now());
    }
  });
}
