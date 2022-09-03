import { BaseChannel } from 'lisk-framework';
import { cryptography } from 'lisk-sdk';
import { Server } from 'socket.io';
import { invokeGetNFT } from '../../enevti_http_api/utils/invoker/redeemable_nft_module';
import idBufferToNFT from '../../enevti_http_api/utils/transformer/idBufferToNFT';
import { sendDataOnlyTopicMessaging } from '../../enevti_socket_io/utils/firebase';
import { generateCallId } from '../utils/call';
import { isRedeemTimeUTC } from '../utils/redeemDate';
import {
  initCallRegistry,
  removeCallRegistry,
  setAllCallRegistryStatus,
  setCallRegistry,
  setCallRegistryStatus,
} from '../utils/registry';

export type TwilioConfig = {
  twilioAccountSid: string;
  twilioApiKeySid: string;
  twilioApiKeySecret: string;
};

export function callHandler(channel: BaseChannel, io: Server, twilioConfig: TwilioConfig) {
  io.on('connection', socket => {
    socket.on(
      'startVideoCall',
      async (params: { nftId: string; signature: string; publicKey: string }) => {
        const nft = await invokeGetNFT(channel, params.nftId);
        if (!nft) {
          socket.to(socket.id).emit('callError', { code: 404, reason: 'nft not found' });
          return;
        }

        if (
          !cryptography.verifyData(
            cryptography.stringToBuffer(params.nftId),
            Buffer.from(params.signature, 'hex'),
            Buffer.from(params.publicKey, 'hex'),
          )
        ) {
          socket.to(socket.id).emit('callError', { code: 401, reason: 'unauthorized' });
          return;
        }

        const address = cryptography.getAddressFromPublicKey(Buffer.from(params.publicKey, 'hex'));
        if (
          Buffer.compare(nft.creator, address) !== 0 &&
          Buffer.compare(nft.owner, address) !== 0
        ) {
          socket.to(socket.id).emit('callError', { code: 401, reason: 'unauthorized' });
          return;
        }

        const nftTransformed = await idBufferToNFT(channel, nft.id);
        if (!nftTransformed) {
          socket.to(socket.id).emit('callError', { code: 404, reason: 'nft not found' });
          return;
        }
        if (!isRedeemTimeUTC(nftTransformed)) {
          socket.to(socket.id).emit('callError', { code: 401, reason: 'unauthorized' });
          return;
        }

        const socketId = await generateCallId();
        await socket.leave(socket.id);
        await socket.join(socketId);

        let callTo = '';
        let caller = '';
        if (Buffer.compare(address, nft.owner) === 0) {
          callTo = nft.creator.toString('hex');
          caller = 'owner';
        }
        if (Buffer.compare(address, nft.creator) === 0) {
          callTo = nft.owner.toString('hex');
          caller = 'creator';
        }
        initCallRegistry(socketId, address.toString('hex'));
        await sendDataOnlyTopicMessaging(channel, callTo, 'startVideoCall', {
          socketId,
          caller,
          nftId: nftTransformed.id,
        });
      },
    );

    socket.on('noAnswer', (params: { callId: string; emitter: string }) => {
      setCallRegistryStatus(params.callId, params.emitter, 'disconnected');
      socket.disconnect();
    });

    socket.on('ringing', async (params: { callId: string; emitter: string }) => {
      await socket.leave(socket.id);
      socket.to(params.callId).emit('callRinging');
      await socket.join(params.callId);
      initCallRegistry(params.callId, params.emitter);
      setAllCallRegistryStatus(params.callId, 'connected');
    });

    socket.on('rejected', (params: { callId: string; emitter: string }) => {
      setAllCallRegistryStatus(params.callId, 'disconnected');
      socket.to(params.callId).emit('callRejected', { emitter: params.emitter });
    });

    socket.on('answered', (params: { callId: string; emitter: string }) => {
      setAllCallRegistryStatus(params.callId, 'incall');
      socket.to(params.callId).emit('callAnswered', { emitter: params.emitter }); // TODO: add twilio account here
    });

    socket.on('ended', (params: { callId: string; emitter: string }) => {
      setAllCallRegistryStatus(params.callId, 'disconnected');
      socket.to(params.callId).emit('callEnded', { emitter: params.emitter });
    });

    socket.on('videoTurnedOff', (params: { callId: string; emitter: string }) => {
      setCallRegistry(params.callId, { address: params.emitter, video: false });
      socket.to(params.callId).emit('videoTurnedOff', { emitter: params.emitter });
    });

    socket.on('videoTurnedOn', (params: { callId: string; emitter: string }) => {
      setCallRegistry(params.callId, { address: params.emitter, video: true });
      socket.to(params.callId).emit('videoTurnedOn', { emitter: params.emitter });
    });

    socket.on('audioTurnedOff', (params: { callId: string; emitter: string }) => {
      setCallRegistry(params.callId, { address: params.emitter, audio: false });
      socket.to(params.callId).emit('audioTurnedOff', { emitter: params.emitter });
    });

    socket.on('audioTurnedOn', (params: { callId: string; emitter: string }) => {
      setCallRegistry(params.callId, { address: params.emitter, audio: true });
      socket.to(params.callId).emit('audioTurnedOn', { emitter: params.emitter });
    });

    socket.on('disconnect', () => {
      if (socket.rooms.size === 0) return;
      const callId = socket.rooms[0] as string;
      socket.to(callId).emit('callDisconnected');
      removeCallRegistry(callId);
    });

    // TODO: newChatMessage
  });
}
