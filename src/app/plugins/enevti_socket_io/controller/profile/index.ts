import { BaseChannel } from 'lisk-framework';
import { Server } from 'socket.io';

export function onUsernameUpdated(channel: BaseChannel, io: Server) {
  channel.subscribe('persona:newUsername', data => {
    if (data) {
      const payload = data as { address: string; username: string };
      io.emit(`profile:${payload.address}`, {
        type: 'newUsername',
        target: payload.address,
        payload: payload.username,
      });
    }
  });
}

export function onBalancePlus(channel: BaseChannel, io: Server) {
  channel.subscribe('persona:balancePlus', data => {
    if (data) {
      const payload = data as { address: string; amount: string };
      io.emit(`profile:${payload.address}`, {
        type: 'balancePlus',
        target: payload.address,
        payload: payload.amount,
      });
    }
  });
}

export function onBalanceMinus(channel: BaseChannel, io: Server) {
  channel.subscribe('persona:balanceMinus', data => {
    if (data) {
      const payload = data as { address: string; amount: string };
      io.emit(`profile:${payload.address}`, {
        type: 'balanceMinus',
        target: payload.address,
        payload: payload.amount,
      });
    }
  });
}

export function onTotalStakePlus(channel: BaseChannel, io: Server) {
  channel.subscribe('creatorFinance:totalStakePlus', data => {
    if (data) {
      const payload = data as { address: string; totalStake: bigint };
      io.emit(`profile:${payload.address}`, {
        type: 'totalStakePlus',
        target: payload.address,
        payload: payload.totalStake.toString(),
      });
    }
  });
}
