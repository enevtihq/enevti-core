import { BaseChannel } from 'lisk-framework';
import { cryptography } from 'lisk-sdk';
import { Server } from 'socket.io';
import { invokeGetNFT } from '../../enevti_http_api/utils/invoker/redeemable_nft_module';
import idBufferToNFT from '../../enevti_http_api/utils/transformer/idBufferToNFT';
import { sendDataOnlyTopicMessaging } from '../../enevti_socket_io/utils/firebase';
import {
  getCallIdByAddress,
  mapAddressToCallId,
  removeCallIdMapByAddress,
} from '../utils/addressToCallId';
import { generateCallId } from '../utils/call';
import { isRedeemTimeUTC } from '../utils/redeemDate';
import { getCallIdByRoom, mapRoomToCallId, removeCallIdMapByRoom } from '../utils/roomToCallId';
import {
  getAddressBySocket,
  mapSocketToAddress,
  removeAddressMapBySocket,
} from '../utils/socketToAddress';
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

          const existingCallId = getCallIdByRoom(`${nft.symbol}#${nft.serial}`);
          if (existingCallId !== undefined) {
            socket.emit('callReconnect', { callId: existingCallId, emitter: params.publicKey });
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

          const callIdAtAddress = getCallIdByAddress(address.toString('hex'));
          if (callIdAtAddress !== undefined) {
            socket.emit('callBusy');
            socket
              .to(callIdAtAddress)
              .emit('someoneIsCalling', { nftId: params.nftId, emitter: params.publicKey });
            return;
          }
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

          await socket.leave(socket.id);
          await socket.join(socketId);

          const twilioToken = await generateTwilioToken(params.publicKey, nft, twilioConfig);
          await sendDataOnlyTopicMessaging(channel, callTo, 'startVideoCall', {
            socketId,
            caller,
            nftId: nftTransformed.id,
          });
          socket
            .to(socketId)
            .emit('callStarted', { callId: socketId, emitter: params.publicKey, twilioToken });

          mapRoomToCallId(`${nft.symbol}#${nft.serial}`, socketId);
          mapAddressToCallId(address.toString('hex'), socketId);
          mapSocketToAddress(socket.id, address.toString('hex'));
        } catch (err) {
          socket.to(socketId).emit('callError', { code: 500, reason: 'internal-error' });
        }
      },
    );

    socket.on('ringing', (params: { callId: string; emitter: string }) => {
      try {
        socket.to(params.callId).emit('callRinging');
      } catch (err) {
        socket.to(params.callId).emit('callError', { code: 500, reason: 'internal-error' });
      }
    });

    socket.on('rejected', (params: { callId: string; emitter: string }) => {
      try {
        socket.to(params.callId).emit('callRejected', { emitter: params.emitter });
      } catch (err) {
        socket.to(params.callId).emit('callError', { code: 500, reason: 'internal-error' });
      }
    });

    socket.on('answered', async (params: { nftId: string; callId: string; emitter: string }) => {
      try {
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

        const address = cryptography.getAddressFromPublicKey(Buffer.from(params.emitter, 'hex'));
        mapAddressToCallId(address.toString('hex'), params.callId);
        mapSocketToAddress(socket.id, address.toString('hex'));
      } catch (err) {
        socket.to(params.callId).emit('callError', { code: 500, reason: 'internal-error' });
      }
    });

    socket.on('ended', async (params: { nftId: string; callId: string; emitter: string }) => {
      try {
        const nft = await invokeGetNFT(channel, params.nftId);
        if (!nft) {
          socket.emit('callError', { code: 404, reason: 'nft-not-found' });
          return;
        }

        socket.to(params.callId).emit('callEnded', { emitter: params.emitter });
        if (getCallIdByRoom(`${nft.symbol}#${nft.serial}`)) {
          removeCallIdMapByRoom(`${nft.symbol}#${nft.serial}`);
        }
      } catch (err) {
        socket.to(params.callId).emit('callError', { code: 500, reason: 'internal-error' });
      }
    });

    socket.on('disconnecting', () => {
      try {
        const address = getAddressBySocket(socket.id);
        removeAddressMapBySocket(socket.id);
        removeCallIdMapByAddress(address);
        for (const room of socket.rooms) {
          socket.to(room).emit('callDisconnected');
        }
      } catch (err) {
        for (const room of socket.rooms) {
          socket.to(room).emit('callError', { code: 500, reason: 'internal-error' });
        }
      }
    });

    // TODO: newChatMessage
  });
}
