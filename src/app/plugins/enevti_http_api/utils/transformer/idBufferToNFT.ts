/* eslint-disable import/no-cycle */
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import { invokeGetNFT } from '../invoker/redeemable_nft_module';
import idBufferToActivityNFT from './idBufferToActivityNFT';
import { idBufferToMomentAt } from './idBufferToMomentAt';
import { minimizeMoment } from './minimizeToBase';
import nftChainToUI from './nftChainToUI';

export default async function idBufferToNFT(
  channel: BaseChannel,
  id: Buffer,
  withMoment = true,
): Promise<NFT | undefined> {
  const nft = await invokeGetNFT(channel, id.toString('hex'));
  if (!nft) return undefined;
  const activity = await idBufferToActivityNFT(channel, id);
  const restNFT = await nftChainToUI(channel, nft);
  const moment = withMoment
    ? (await idBufferToMomentAt(channel, id)).map(momentItem => minimizeMoment(momentItem))
    : [];
  return {
    ...nft,
    ...restNFT,
    activity,
    moment,
  };
}
