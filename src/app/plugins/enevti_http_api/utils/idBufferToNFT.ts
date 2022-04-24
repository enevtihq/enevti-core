import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../types/core/chain/nft';
import { invokeGetNFT } from './hook/redeemable_nft_module';
import idBufferToActivityNFT from './idBufferToActivityNFT';
import nftChainToUI from './nftChainToUI';

export default async function idBufferToNFT(
  channel: BaseChannel,
  id: Buffer,
): Promise<NFT | undefined> {
  const nft = await invokeGetNFT(channel, id.toString('hex'));
  if (!nft) return undefined;
  const activity = await idBufferToActivityNFT(channel, id);
  const restNFT = await nftChainToUI(channel, nft);
  return {
    ...nft,
    ...restNFT,
    activity,
  };
}
