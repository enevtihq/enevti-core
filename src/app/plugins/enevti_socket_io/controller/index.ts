import { BaseChannel } from 'lisk-framework';
import { Server, Socket } from 'socket.io';
import * as admin from 'firebase-admin';
import { onNewActivityCollection, onNewActivityNFT, onNewActivityProfile } from './activity';
import { onNewCollectionLike, onNewNFTMinted } from './collection';
import { onNewFeedItem } from './feeds';
import {
  onBalanceChanged,
  onNewCollectionByAddress,
  onNewPendingByAddress,
  onPendingUtilityDelivery,
  onSecretDelivered,
  onTotalNFTSoldChanged,
  onTotalStakeChanged,
  onUsernameUpdated,
} from './profile';
import { onStakerUpdates } from './stake';
import { onNewNFTLike } from './nft';
import { onNewBlock } from './app';

export function createEnevtiSocket(
  channel: BaseChannel,
  io: Server | Socket,
  firebaseAdmin: typeof admin | undefined,
) {
  // App Socket
  onNewBlock(channel, io);

  // Profile Socket
  onUsernameUpdated(channel, io);
  onBalanceChanged(channel, io);
  onTotalStakeChanged(channel, io);
  onNewCollectionByAddress(channel, io);
  onNewPendingByAddress(channel, io);
  onPendingUtilityDelivery(channel, io, firebaseAdmin);
  onTotalNFTSoldChanged(channel, io);
  onSecretDelivered(channel, io);

  // Stake Socket
  onStakerUpdates(channel, io);

  // Feed Socket
  onNewFeedItem(channel, io);

  // Collection Socket
  onNewNFTMinted(channel, io);
  onNewCollectionLike(channel, io);

  // NFT Socket
  onNewNFTLike(channel, io);

  // Activity Socket
  onNewActivityCollection(channel, io);
  onNewActivityNFT(channel, io);
  onNewActivityProfile(channel, io);
}

export function registerAccountSocket(io: Server) {
  io.on('connection', socket => {
    socket.on('register', async (address: string) => {
      await socket.join(address);
    });
  });
}
