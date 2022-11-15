import { BaseChannel } from 'lisk-framework';
import { apiClient } from 'lisk-sdk';
import { Server, Socket } from 'socket.io';
import { I18n } from 'i18n';
import { onNewActivityCollection, onNewActivityNFT, onNewActivityProfile } from './activity';
import { onNewCollectionComment, onNewCollectionLike, onNewNFTMinted } from './collection';
import { onNewFeedItem } from './feeds';
import {
  onBalanceChanged,
  onNewCollectionByAddress,
  onNewPendingByAddress,
  onPendingUtilityDelivery,
  onSecretDelivered,
  onTotalMomentSlotChanged,
  onTotalNFTSoldChanged,
  onTotalServeRateChanged,
  onTotalStakeChanged,
  onUsernameUpdated,
} from './profile';
import { onStakerUpdates } from './stake';
import { onNewNFTComment, onNewNFTLike, onVideoCallStatusChanged } from './nft';
import { onDeletedBlock, onNewBlock } from './app';
import { onNewRaffled, onWonRaffle } from './raffle';
import { getAddressBySocketId, mapAddress, removeMapBySocket } from '../utils/mapper';

export function createEnevtiSocket(
  channel: BaseChannel,
  io: Server | Socket,
  client: apiClient.APIClient,
  i18n: I18n,
) {
  // App Socket
  onNewBlock(channel, io, client);
  onDeletedBlock(channel, io, client);

  // Profile Socket
  onUsernameUpdated(channel, io);
  onBalanceChanged(channel, io);
  onTotalStakeChanged(channel, io);
  onTotalMomentSlotChanged(channel, io);
  onNewCollectionByAddress(channel, io);
  onNewPendingByAddress(channel, io);
  onPendingUtilityDelivery(channel, io, i18n);
  onTotalNFTSoldChanged(channel, io);
  onTotalServeRateChanged(channel, io);
  onSecretDelivered(channel, io);

  // Stake Socket
  onStakerUpdates(channel, io);

  // Feed Socket
  onNewFeedItem(channel, io);

  // Collection Socket
  onNewNFTMinted(channel, io);
  onNewCollectionLike(channel, io);
  onNewCollectionComment(channel, io);

  // NFT Socket
  onNewNFTLike(channel, io);
  onNewNFTComment(channel, io);
  onVideoCallStatusChanged(channel, io);

  // Activity Socket
  onNewActivityCollection(channel, io);
  onNewActivityNFT(channel, io);
  onNewActivityProfile(channel, io);

  // Social Raffle
  onNewRaffled(channel, io);
  onWonRaffle(channel, io);
}

export function registerAccountSocket(io: Server) {
  io.on('connection', socket => {
    socket.on('register-room', async (room: string) => {
      await socket.leave(socket.id);
      await socket.join(room);
    });
    socket.on('register-address', (address: string) => {
      mapAddress(address, socket.id);
    });
    socket.on('disconnect', () => {
      if (getAddressBySocketId(socket.id)) {
        removeMapBySocket(socket.id);
      }
    });
  });
}
