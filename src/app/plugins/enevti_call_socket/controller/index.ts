import { BaseChannel } from 'lisk-framework';
import { cryptography } from 'lisk-sdk';
import { Server } from 'socket.io';
import { invokeGetNFT } from '../../enevti_http_api/utils/invoker/redeemable_nft_module';
import idBufferToNFT from '../../enevti_http_api/utils/transformer/idBufferToNFT';
import { sendDataOnlyTopicMessaging } from '../../enevti_socket_io/utils/firebase';
import { generateCallId } from '../utils/call';
import { isRedeemTimeUTC } from '../utils/redeemDate';

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
        await sendDataOnlyTopicMessaging(channel, callTo, 'startVideoCall', {
          socketId,
          caller,
          nftId: nftTransformed.id,
        });
      },
    );
    // TODO: noAnswer
    // TODO: rejected
    // TODO: answered
    // TODO: ended
    // TODO: videoTurnedOff
    // TODO: videoTurnedOn
    // TODO: audioTurnedOff
    // TODO: audioTurnedOn
    // TODO: newChatMessage
  });
}
