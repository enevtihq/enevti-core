import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';
import { invokeGetAccount } from '../../../enevti_http_api/utils/hook/persona_module';

export function onUsernameUpdated(channel: BaseChannel, io: Server) {
  channel.subscribe('persona:usernameChanged', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.emit(`profile:${payload.address}`, {
        type: 'usernameChanged',
        target: payload.address,
        payload: account.dpos.delegate.username,
      });
    }
  });
}

export function onBalanceChanged(channel: BaseChannel, io: Server) {
  channel.subscribe('persona:balanceChanged', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.emit(`profile:${payload.address}`, {
        type: 'balanceChanged',
        target: payload.address,
        payload: account.token.balance.toString(),
      });
    }
  });
}

export function onTotalStakeChanged(channel: BaseChannel, io: Server) {
  channel.subscribe('creatorFinance:totalStakeChanged', async data => {
    if (data) {
      const payload = data as { address: string };
      const account = await invokeGetAccount(channel, payload.address);
      io.emit(`profile:${payload.address}`, {
        type: 'totalStakeChanged',
        target: payload.address,
        payload: account.dpos.delegate.totalVotesReceived.toString(),
      });
    }
  });
}
