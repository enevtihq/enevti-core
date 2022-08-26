import { BaseChannel } from 'lisk-framework';
import { cryptography } from 'lisk-sdk';
import { Server, Socket } from 'socket.io';
import { NFT } from '../../../../../types/core/chain/nft';
import { invokeGetAccount } from '../../../enevti_http_api/utils/hook/persona_module';
import { invokeGetNFT } from '../../../enevti_http_api/utils/hook/redeemable_nft_module';
import { asyncForEach } from '../../../../modules/redeemable_nft/utils/transaction';
import { sendDataOnlyTopicMessaging } from '../../utils/firebase';
import { invokeFCMIsReady } from '../../utils/invoker/fcm';
import { getSocketIdByAddress } from '../../utils/mapper';

export function onUsernameUpdated(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('persona:usernameChanged', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`usernameChanged`, account.dpos.delegate.username);
    }
  });
}

export function onBalanceChanged(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('persona:balanceChanged', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`balanceChanged`, account.token.balance.toString());
    }
  });
}

export function onTotalStakeChanged(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('creatorFinance:totalStakeChanged', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(
        `totalStakeChanged`,
        account.dpos.delegate.totalVotesReceived.toString(),
      );
    }
  });
}

export function onNewCollectionByAddress(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newCollectionByAddress', data => {
    if (data) {
      const payload = data as { address: string; count: number };
      io.to(payload.address).emit(`newProfileUpdates`, Date.now());
    }
  });
}

export function onPendingUtilityDelivery(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:pendingUtilityDelivery', async data => {
    if (data) {
      const isFCMReady = await invokeFCMIsReady(channel);
      const payload = data as { nfts: Buffer[] };
      const accountMap: {
        [address: string]: { id: string; secret: NFT['redeem']['secret'] }[];
      } = {};

      const nfts = await Promise.all(
        payload.nfts.map(async item => {
          const nft = await invokeGetNFT(channel, item.toString('hex'));
          if (!nft) throw new Error('undefined NFT id while subscribing pendingUtilityDelivery');
          return nft;
        }),
      );

      nfts.forEach(nft => {
        if (nft.redeem.status === 'pending-secret' && nft.utility === 'content') {
          const sender = cryptography
            .getAddressFromPublicKey(nft.redeem.secret.sender)
            .toString('hex');
          const secret: NFT['redeem']['secret'] = {
            ...nft.redeem.secret,
            sender: nft.redeem.secret.sender.toString('hex'),
            recipient: nft.redeem.secret.recipient.toString('hex'),
          };
          if (accountMap[sender] === undefined) accountMap[sender] = [];
          accountMap[sender].push({ id: nft.id.toString('hex'), secret });
        }
      });

      await asyncForEach(Object.keys(accountMap), async address => {
        if (isFCMReady) {
          try {
            await sendDataOnlyTopicMessaging(channel, address, 'deliverSecretNotif', {
              address,
            });
          } catch (err) {
            io.to(getSocketIdByAddress(address)).emit('deliverSecretNotif', address);
          }
        } else {
          io.to(getSocketIdByAddress(address)).emit('deliverSecretNotif', address);
        }
      });
    }
  });
}

export function onSecretDelivered(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:secretDelivered', async data => {
    if (data) {
      const payload = data as { nft: string };
      const nft = await invokeGetNFT(channel, payload.nft);
      if (!nft) throw new Error('undefined NFT id while subscribing secretDelivered');
      const { secret, content } = nft.redeem;
      io.to(nft.owner.toString('hex')).emit(`secretDelivered`, {
        id: nft.id.toString('hex'),
        secret,
        content,
      });
      io.to(nft.id.toString('hex')).emit(`secretDelivered`, { secret });
    }
  });
}

export function onTotalNFTSoldChanged(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:totalNFTSoldChanged', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`totalNFTSoldChanged`, account.redeemableNft.nftSold);
    }
  });
}

export function onTotalServeRateChanged(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:totalServeRateChanged', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`totalServeRateChanged`, account.redeemableNft.serveRate);
    }
  });
}

export function onNewPendingByAddress(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newPendingByAddress', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`newPending`, account.redeemableNft.pending.length);
    }
  });
}
