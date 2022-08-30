import { BaseChannel } from 'lisk-framework';
import { cryptography } from 'lisk-sdk';
import { Server } from 'socket.io';
import { invokeGetNFT } from '../../enevti_http_api/utils/invoker/redeemable_nft_module';
import idBufferToNFT from '../../enevti_http_api/utils/transformer/idBufferToNFT';
import { sendDataOnlyTopicMessaging } from '../../enevti_socket_io/utils/firebase';
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

        const address = cryptography.getAddressFromPublicKey(Buffer.from(params.publicKey, 'hex'));
        if (Buffer.compare(address, nft.owner) !== 0) {
          socket.to(socket.id).emit('callError', { code: 401, reason: 'unauthorized' });
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

        const nftTransformed = await idBufferToNFT(channel, nft.id);
        if (!nftTransformed) {
          socket.to(socket.id).emit('callError', { code: 404, reason: 'nft not found' });
          return;
        }
        if (!isRedeemTimeUTC(nftTransformed)) {
          socket.to(socket.id).emit('callError', { code: 401, reason: 'unauthorized' });
          return;
        }

        await sendDataOnlyTopicMessaging(channel, nft.creator.toString('hex'), 'startVideoCall', {
          socketId: socket.id,
          nftId: nftTransformed.id,
        });
      },
    );
  });
}
