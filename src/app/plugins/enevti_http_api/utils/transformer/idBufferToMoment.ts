/* eslint-disable import/no-cycle */
import { BaseChannel } from 'lisk-framework';
import { Moment } from '../../../../../types/core/chain/moment';
import { invokeGetIPFSTextCache } from '../../../ipfs_text_cache/utils/invoker';
import { invokeGetLiked, invokeGetMoment } from '../invoker/redeemable_nft_module';
import addressBufferToPersona from './addressBufferToPersona';
import chainDateToUI from './chainDateToUI';
import idBufferToNFT from './idBufferToNFT';
import { minimizeNFT } from './minimizeToBase';

export default async function idBufferToMoment(
  channel: BaseChannel,
  id: Buffer,
  viewer?: string,
): Promise<Moment | undefined> {
  const moment = await invokeGetMoment(channel, id.toString('hex'));
  if (!moment) return undefined;
  const nft = await idBufferToNFT(channel, moment.nftId, false, viewer);
  if (!nft) return undefined;
  const liked = viewer ? (await invokeGetLiked(channel, id.toString('hex'), viewer)) === 1 : false;
  return {
    ...moment,
    id: moment.id.toString('hex'),
    nftId: moment.nftId.toString('hex'),
    nft: minimizeNFT(nft),
    owner: await addressBufferToPersona(channel, moment.owner),
    creator: await addressBufferToPersona(channel, moment.creator),
    createdOn: chainDateToUI(moment.createdOn),
    textPlain: await invokeGetIPFSTextCache(channel, moment.text),
    liked,
  };
}
