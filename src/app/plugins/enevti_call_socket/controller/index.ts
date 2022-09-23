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
import {
  getPublicKeyByAddress,
  mapAddressToPublicKey,
  removePublicKeyMapByAddress,
} from '../utils/addressToPublicKey';
import {
  getRejectableCallIdByAddress,
  mapAddressToRejectableCallId,
  removeRejectableCallIdMapByAddress,
} from '../utils/addressToRejectableCall';
import { generateCallId } from '../utils/call';
import { getRoomByCallId, mapCallIdToRoom, removeRoomMapByCallId } from '../utils/callIdToRoom';
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

          const address = cryptography.getAddressFromPublicKey(
            Buffer.from(params.publicKey, 'hex'),
          );

          const existingCallId = getCallIdByRoom(`${nft.symbol}#${nft.serial}`);
          if (existingCallId !== undefined) {
            mapAddressToCallId(address.toString('hex'), existingCallId);
            mapSocketToAddress(socket.id, address.toString('hex'));
            mapAddressToPublicKey(address.toString('hex'), params.publicKey);
            await socket.leave(socket.id);
            await socket.join(existingCallId);
            socket
              .to(existingCallId)
              .emit('callReconnect', { callId: existingCallId, emitter: params.publicKey });
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

          if (
            Buffer.compare(nft.creator, address) !== 0 &&
            Buffer.compare(nft.owner, address) !== 0
          ) {
            socket.emit('callError', { code: 401, reason: 'unauthorized' });
            return;
          }

          console.log('genti ini jadi nonce');
          if (nft.redeem.limit > 0 && nft.redeem.count >= nft.redeem.limit) {
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

          const callIdAtAddress = getCallIdByAddress(callTo);
          if (callIdAtAddress !== undefined) {
            socket.emit('callBusy');
            socket
              .to(callIdAtAddress)
              .emit('someoneIsCalling', { nftId: params.nftId, emitter: params.publicKey });
            return;
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

          mapAddressToCallId(address.toString('hex'), socketId);
          mapSocketToAddress(socket.id, address.toString('hex'));
          mapAddressToPublicKey(address.toString('hex'), params.publicKey);
        } catch (err) {
          socket.to(socketId).emit('callError', { code: 500, reason: 'internal-error' });
        }
      },
    );

    socket.on('ringing', (params: { callId: string; emitter: string; signature: string }) => {
      try {
        if (
          !cryptography.verifyData(
            cryptography.stringToBuffer(params.callId),
            Buffer.from(params.signature, 'hex'),
            Buffer.from(params.emitter, 'hex'),
          )
        ) {
          socket.emit('callError', { code: 401, reason: 'unauthorized' });
          return;
        }

        const address = cryptography.getAddressFromPublicKey(Buffer.from(params.emitter, 'hex'));
        mapAddressToRejectableCallId(address.toString('hex'), params.callId);
        mapSocketToAddress(socket.id, address.toString('hex'));
        mapAddressToPublicKey(address.toString('hex'), params.emitter);
        socket.to(params.callId).emit('callRinging');
      } catch (err) {
        socket.to(params.callId).emit('callError', { code: 500, reason: 'internal-error' });
      }
    });

    socket.on('accepted', (params: { callId: string; emitter: string; signature }) => {
      if (
        !cryptography.verifyData(
          cryptography.stringToBuffer(params.callId),
          Buffer.from(params.signature, 'hex'),
          Buffer.from(params.emitter, 'hex'),
        )
      ) {
        socket.emit('callError', { code: 401, reason: 'unauthorized' });
        return;
      }

      const address = cryptography.getAddressFromPublicKey(Buffer.from(params.emitter, 'hex'));
      removeRejectableCallIdMapByAddress(address.toString('hex'));
    });

    socket.on(
      'answered',
      async (params: { nftId: string; callId: string; emitter: string; signature: string }) => {
        try {
          const callRoom = io.sockets.adapter.rooms.get(params.callId);
          if (callRoom === undefined) {
            socket.emit('callError', { code: 404, reason: 'room-not-found' });
            return;
          }

          if (
            !cryptography.verifyData(
              cryptography.stringToBuffer(params.nftId),
              Buffer.from(params.signature, 'hex'),
              Buffer.from(params.emitter, 'hex'),
            )
          ) {
            socket.emit('callError', { code: 401, reason: 'unauthorized' });
            return;
          }

          const nft = await invokeGetNFT(channel, params.nftId);
          if (!nft) {
            socket.to(params.callId).emit('callError', { code: 404, reason: 'nft-not-found' });
            return;
          }

          const address = cryptography.getAddressFromPublicKey(Buffer.from(params.emitter, 'hex'));

          const existingCallId = getCallIdByRoom(`${nft.symbol}#${nft.serial}`);
          if (existingCallId !== undefined) {
            mapSocketToAddress(socket.id, address.toString('hex'));
            mapAddressToCallId(address.toString('hex'), existingCallId);
            mapAddressToPublicKey(address.toString('hex'), params.emitter);
            await socket.leave(socket.id);
            await socket.join(existingCallId);
            socket
              .to(existingCallId)
              .emit('callReconnect', { callId: existingCallId, emitter: params.emitter });
            return;
          }

          await socket.leave(socket.id);
          await socket.join(params.callId);

          const twilioToken = await generateTwilioToken(params.emitter, nft, twilioConfig);
          if (!twilioToken) {
            socket.to(params.callId).emit('callError', { code: 500, reason: 'twilio-error' });
            return;
          }

          socket.to(params.callId).emit('callAnswered', { emitter: params.emitter, twilioToken });

          mapRoomToCallId(`${nft.symbol}#${nft.serial}`, params.callId);
          mapCallIdToRoom(params.callId, `${nft.symbol}#${nft.serial}`);
          mapAddressToCallId(address.toString('hex'), params.callId);
          mapSocketToAddress(socket.id, address.toString('hex'));
          mapAddressToPublicKey(address.toString('hex'), params.emitter);
        } catch (err) {
          socket.to(params.callId).emit('callError', { code: 500, reason: 'internal-error' });
        }
      },
    );

    socket.on(
      'ended',
      async (params: { nftId: string; callId: string; emitter: string; signature: string }) => {
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
              Buffer.from(params.emitter, 'hex'),
            )
          ) {
            socket.emit('callError', { code: 401, reason: 'unauthorized' });
            return;
          }

          socket.to(params.callId).emit('callEnded', { emitter: params.emitter });
          if (getCallIdByRoom(`${nft.symbol}#${nft.serial}`)) {
            removeCallIdMapByRoom(`${nft.symbol}#${nft.serial}`);
            removeRoomMapByCallId(params.callId);
          }
        } catch (err) {
          socket.to(params.callId).emit('callError', { code: 500, reason: 'internal-error' });
        }
      },
    );

    socket.on('disconnecting', () => {
      try {
        const address = getAddressBySocket(socket.id);
        const callId = getCallIdByAddress(address);

        const rejectableCallId = getRejectableCallIdByAddress(address);
        if (rejectableCallId !== undefined) {
          removeRejectableCallIdMapByAddress(address);
          socket
            .to(rejectableCallId)
            .emit('callRejected', { emitter: getPublicKeyByAddress(address) });
        }

        removeAddressMapBySocket(socket.id);
        removePublicKeyMapByAddress(address);
        removeCallIdMapByAddress(address);

        const room = getRoomByCallId(callId);
        if (room !== undefined) {
          for (const rooms of socket.rooms) {
            socket.to(rooms).emit('callDisconnected');
          }
        }
      } catch (err) {
        for (const room of socket.rooms) {
          socket.to(room).emit('callError', { code: 500, reason: 'internal-error' });
        }
      }
    });

    // TODO: newChatMessage
    // TODO: tip
  });
}
