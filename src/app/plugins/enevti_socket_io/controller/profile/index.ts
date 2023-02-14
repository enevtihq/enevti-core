import { BaseChannel } from 'lisk-framework';
import { cryptography } from 'lisk-sdk';
import { Server, Socket } from 'socket.io';
import { I18n } from 'i18n';
import { NFT } from 'enevti-types/chain/nft';
import { invokeGetAccount } from '../../../enevti_http_api/utils/invoker/persona_module';
import { invokeGetNFT } from '../../../enevti_http_api/utils/invoker/redeemable_nft_module';
import { asyncForEach } from '../../../../modules/redeemable_nft/utils/transaction';
import { sendDataNotificationToAddress } from '../../utils/pushNotification';
import { getSocketIdByAddress } from '../../utils/mapper';
import { invokeFCMIsReady } from '../../../firebase_cloud_messaging/utils/invoker';
import { delayEmit } from '../../utils/delayEmit';
import { invokeGetEnevtiUserMeta } from '../../../enevti_user_meta/utils/invoker';
import { DEFAULT_LOCALE } from '../../translations/i18n.config';

export function onUsernameUpdated(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('persona:usernameChanged', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`usernameChanged`, account.dpos.delegate.username);
    }
  });
}

export function onBalanceChanged(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('persona:balanceChanged', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`balanceChanged`, account.token.balance.toString());
    }
  });
}

export function onTotalStakeChanged(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('creatorFinance:totalStakeChanged', async data => {
    if (data) {
      await delayEmit();
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
  channel.subscribe('redeemableNft:newCollectionByAddress', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { address: string; count: number };
      io.to(payload.address).emit(`newProfileUpdates`, Date.now());
    }
  });
}

export function onPendingUtilityDelivery(channel: BaseChannel, io: Server | Socket, i18n: I18n) {
  channel.subscribe('redeemableNft:pendingUtilityDelivery', async data => {
    if (data) {
      await delayEmit();
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
            const userMeta = await invokeGetEnevtiUserMeta(channel, address);
            const addressLocale = userMeta ? userMeta.locale : DEFAULT_LOCALE;
            await sendDataNotificationToAddress(
              channel,
              address,
              'deliverSecretNotif',
              { address },
              i18n.__({ phrase: 'Yeayy, your NFT is sold!', locale: addressLocale }),
              i18n.__({ phrase: 'Click this to claim your rewards!', locale: addressLocale }),
              accountMap[address].length,
            );
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
      await delayEmit();
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
      await delayEmit();
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`totalNFTSoldChanged`, account.redeemableNft.nftSold);
    }
  });
}

export function onTotalServeRateChanged(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:totalServeRateChanged', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`totalServeRateChanged`, account.redeemableNft.serveRate);
    }
  });
}

export function onTotalMomentSlotChanged(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:totalMomentSlotChanged', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`totalMomentSlotChanged`, account.redeemableNft.momentSlot);
    }
  });
}

export function onNewPendingByAddress(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newPendingByAddress', async data => {
    if (data) {
      await delayEmit();
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`newPending`, account.redeemableNft.pending.length);
    }
  });
}
