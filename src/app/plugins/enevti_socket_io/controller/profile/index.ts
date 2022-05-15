import { BaseChannel } from 'lisk-framework';
import { cryptography } from 'lisk-sdk';
import { Server, Socket } from 'socket.io';
import { NFT } from '../../../../../types/core/chain/nft';
import { invokeGetAccount } from '../../../enevti_http_api/utils/hook/persona_module';
import { invokeGetNFT } from '../../../enevti_http_api/utils/hook/redeemable_nft_module';
import idBufferToCollection from '../../../enevti_http_api/utils/transformer/idBufferToCollection';

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
  channel.subscribe('redeemableNft:newCollectionByAddress', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      const accountCollection = await Promise.all(
        account.redeemableNft.collection.map(async item => {
          const collection = await idBufferToCollection(channel, item);
          if (!collection)
            throw new Error(
              'Undefined collection id while iterating account.redeemableNft.collection',
            );
          return collection;
        }),
      );
      io.to(payload.address).emit(`newCollection`, accountCollection);
    }
  });
}

export function onPendingUtilityDelivery(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:pendingUtilityDelivery', async data => {
    if (data) {
      const payload = data as { nft: string };
      const nft = await invokeGetNFT(channel, payload.nft);
      if (!nft) throw new Error('undefined NFT id while subscribing pendingUtilityDelivery');
      if (nft.redeem.status === 'pending-secret' && nft.utility === 'content') {
        const sender = cryptography.getAddressFromPublicKey(nft.redeem.secret.sender);
        const secret: NFT['redeem']['secret'] = {
          ...nft.redeem.secret,
          sender: nft.redeem.secret.sender.toString('hex'),
          recipient: nft.redeem.secret.recipient.toString('hex'),
        };
        io.to(sender.toString('hex')).emit(`deliverSecretNotif`, {
          id: payload.nft,
          secret,
        });
      }
    }
  });
}

export function onSecretDelivered(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:secretDelivered', async data => {
    if (data) {
      const payload = data as { nft: string };
      const nft = await invokeGetNFT(channel, payload.nft);
      if (!nft) throw new Error('undefined NFT id while subscribing pendingUtilityDelivery');
      const { secret, content } = nft.redeem;
      io.to(nft.owner.toString('hex')).emit(`secretDelivered`, {
        id: nft.id.toString('hex'),
        secret,
        content,
      });
      io.to(nft.id.toString('hex')).emit(`secretDelivered`, {
        id: nft.id.toString('hex'),
        secret,
      });
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

export function onNewPendingByAddress(channel: BaseChannel, io: Server | Socket) {
  channel.subscribe('redeemableNft:newPendingByAddress', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`newPending`, account.redeemableNft.pending.length);
    }
  });
}
