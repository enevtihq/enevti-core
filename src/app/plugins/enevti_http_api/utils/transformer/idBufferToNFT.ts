/* eslint-disable import/no-cycle */
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import { invokeGetLiked, invokeGetNFT } from '../invoker/redeemable_nft_module';
import idBufferToActivityNFT from './idBufferToActivityNFT';
import { idBufferToMomentAt } from './idBufferToMomentAt';
import { minimizeMoment } from './minimizeToBase';
import nftChainToUI from './nftChainToUI';

export default async function idBufferToNFT(
  channel: BaseChannel,
  id: Buffer,
  withMoment = true,
  viewer?: string,
): Promise<NFT | undefined> {
  const nft = await invokeGetNFT(channel, id.toString('hex'));
  if (!nft) return undefined;
  const activity = await idBufferToActivityNFT(channel, id);
  const restNFT = await nftChainToUI(channel, nft);
  const liked = viewer ? (await invokeGetLiked(channel, id.toString('hex'), viewer)) === 1 : false;
  const moment = withMoment
    ? (await idBufferToMomentAt(channel, id, viewer)).map(momentItem => minimizeMoment(momentItem))
    : [];
  return {
    ...nft,
    ...restNFT,
    activity,
    moment,
    liked,
  };
}
