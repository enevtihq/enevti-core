import * as twilio from 'twilio';
import { RoomInstance } from 'twilio/lib/rest/video/v1/room';
import { NFTAsset } from 'enevti-types/chain/nft';

export type TwilioConfig = {
  twilioAccountSid: string;
  twilioApiKeySid: string;
  twilioApiKeySecret: string;
};

export async function generateTwilioToken(
  emitter: string,
  nft: NFTAsset,
  twilioConfig: TwilioConfig,
) {
  const identity = emitter;
  const roomName = `${nft.symbol}#${nft.serial}`;

  const { AccessToken } = twilio.jwt;
  const { VideoGrant } = AccessToken;
  const twilioClient = twilio(twilioConfig.twilioApiKeySid, twilioConfig.twilioApiKeySecret, {
    accountSid: twilioConfig.twilioAccountSid,
  });

  try {
    const roomList: RoomInstance[] = await twilioClient.video.rooms.list({
      uniqueName: roomName,
      status: 'in-progress',
    });

    let room: RoomInstance;

    if (!roomList.length) {
      room = await twilioClient.video.rooms.create({
        uniqueName: roomName,
        type: 'go',
      });
    } else {
      [room] = roomList;
    }

    const videoGrant = new VideoGrant({
      room: room.uniqueName,
    });

    const token = new AccessToken(
      twilioConfig.twilioAccountSid,
      twilioConfig.twilioApiKeySid,
      twilioConfig.twilioApiKeySecret,
    );

    token.addGrant(videoGrant);
    token.identity = identity;

    return token.toJwt();
  } catch (error) {
    return undefined;
  }
}
