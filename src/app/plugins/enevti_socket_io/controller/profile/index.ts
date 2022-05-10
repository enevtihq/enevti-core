import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';
import { invokeGetAccount } from '../../../enevti_http_api/utils/hook/persona_module';
import idBufferToCollection from '../../../enevti_http_api/utils/transformer/idBufferToCollection';

export function onUsernameUpdated(channel: BaseChannel, io: Server) {
  channel.subscribe('persona:usernameChanged', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`usernameChanged`, account.dpos.delegate.username);
    }
  });
}

export function onBalanceChanged(channel: BaseChannel, io: Server) {
  channel.subscribe('persona:balanceChanged', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.to(payload.address).emit(`balanceChanged`, account.token.balance.toString());
    }
  });
}

export function onTotalStakeChanged(channel: BaseChannel, io: Server) {
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

export function onNewCollectionByAddress(channel: BaseChannel, io: Server) {
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
