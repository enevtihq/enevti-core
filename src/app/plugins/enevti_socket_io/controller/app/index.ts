import { BaseChannel, Transaction } from 'lisk-framework';
import { apiClient } from 'lisk-sdk';
import { Server, Socket } from 'socket.io';

export function onNewBlock(channel: BaseChannel, io: Server | Socket, client: apiClient.APIClient) {
  channel.subscribe('app:block:new', data => {
    const payload = data as { block: string; accounts: string[] };
    const block = client.block.decode(payload.block);
    (block as { payload: Transaction[] }).payload.forEach((transaction: Transaction) => {
      io.to(`transaction:${transaction.id.toString('hex')}`).emit('processed');
    });
    io.to('chain').emit(`newBlock`, Date.now());
  });
}
