import { BaseChannel } from 'lisk-framework';
import { cryptography } from 'lisk-sdk';
import { Server } from 'socket.io';
import { invokeGetNFT } from '../../enevti_http_api/utils/invoker/redeemable_nft_module';
import idBufferToNFT from '../../enevti_http_api/utils/transformer/idBufferToNFT';
import { sendDataOnlyTopicMessaging } from '../../enevti_socket_io/utils/firebase';
import { generateCallId } from '../utils/call';
import { isRedeemTimeUTC } from '../utils/redeemDate';
import { generateTwilioToken, TwilioConfig } from '../utils/twilio';

export function callHandler(channel: BaseChannel, io: Server, twilioConfig: TwilioConfig) {
  io.on('connection', socket => {
    socket.on(
      'startVideoCall',
      async (params: { nftId: string; signature: string; publicKey: string }) => {
        const socketId = await generateCallId();
        try {
          const nft = await invokeGetNFT(channel, params.nftId);
          if (!nft) {
            socket.emit('callError', { code: 404, reason: 'nft-not-found' });
            return;
          }

          if (
            !cryptography.verifyData(
              cryptography.stringToBuffer(params.nftId),
              Buffer.from(params.signature, 'hex'),
              Buffer.from(params.publicKey, 'hex'),
            )
          ) {
            socket.emit('callError', { code: 401, reason: 'unauthorized' });
            return;
          }

          const address = cryptography.getAddressFromPublicKey(
            Buffer.from(params.publicKey, 'hex'),
          );
          if (
            Buffer.compare(nft.creator, address) !== 0 &&
            Buffer.compare(nft.owner, address) !== 0
          ) {
            socket.emit('callError', { code: 401, reason: 'unauthorized' });
            return;
          }

          const nftTransformed = await idBufferToNFT(channel, nft.id);
          if (!nftTransformed) {
            socket.emit('callError', { code: 404, reason: 'nft-not-found' });
            return;
          }
          if (!isRedeemTimeUTC(nftTransformed)) {
            socket.emit('callError', { code: 401, reason: 'unauthorized' });
            return;
          }

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
          const twilioToken = await generateTwilioToken(params.publicKey, nft, twilioConfig);
          await sendDataOnlyTopicMessaging(channel, callTo, 'startVideoCall', {
            socketId,
            caller,
            nftId: nftTransformed.id,
          });
          socket
            .to(socketId)
            .emit('callStarted', { callId: socketId, emitter: params.publicKey, twilioToken });
        } catch (err) {
          socket.to(socketId).emit('callError', { code: 500, reason: 'internal-error' });
        }
      },
    );

    socket.on('ringing', (params: { callId: string; emitter: string }) => {
      socket.to(params.callId).emit('callRinging');
    });

    socket.on('rejected', (params: { callId: string; emitter: string }) => {
      socket.to(params.callId).emit('callRejected', { emitter: params.emitter });
    });

    socket.on('answered', async (params: { nftId: string; callId: string; emitter: string }) => {
      const callRoom = io.sockets.adapter.rooms.get(params.callId);
      if (callRoom === undefined) {
        socket.emit('callError', { code: 404, reason: 'room-not-found' });
        return;
      }

      await socket.leave(socket.id);
      await socket.join(params.callId);

      const nft = await invokeGetNFT(channel, params.nftId);
      if (!nft) {
        socket.to(params.callId).emit('callError', { code: 404, reason: 'nft-not-found' });
        return;
      }
      const twilioToken = await generateTwilioToken(params.emitter, nft, twilioConfig);
      if (!twilioToken) {
        socket.to(params.callId).emit('callError', { code: 500, reason: 'twilio-error' });
        return;
      }

      socket.to(params.callId).emit('callAnswered', { emitter: params.emitter, twilioToken });
    });

    socket.on('ended', (params: { callId: string; emitter: string }) => {
      socket.to(params.callId).emit('callEnded', { emitter: params.emitter });
    });

    // TODO: newChatMessage
    // TODO: implement all error handling
    // TODO: implement better registry
  });
}
