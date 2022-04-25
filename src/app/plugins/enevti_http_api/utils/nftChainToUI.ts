import { BaseChannel } from 'lisk-framework';
import { NFT, NFTAsset } from '../../../../types/core/chain/nft';
import addressBufferToPersona from './addressBufferToPersona';
import { invokeGetNFTTemplateById } from './hook/redeemable_nft_module';

export default async function nftChainToUI(channel: BaseChannel, nft: NFTAsset) {
  const redeem: NFT['redeem'] = {
    ...nft.redeem,
    secret: {
      ...nft.redeem.secret,
      sender: nft.redeem.secret.sender.toString('hex'),
      recipient: nft.redeem.secret.recipient.toString('hex'),
    },
  };
  const owner = await addressBufferToPersona(channel, nft.owner);
  const creator = await addressBufferToPersona(channel, nft.creator);
  const templateChain = await invokeGetNFTTemplateById(channel, nft.template);
  if (!templateChain) throw new Error('Template not found while processing NFT');
  const template = templateChain.data;
  const price = {
    amount: nft.price.amount.toString(),
    currency: nft.price.currency,
  };
  return {
    id: nft.id.toString('hex'),
    collectionId: nft.collectionId.toString('hex'),
    redeem,
    owner,
    creator,
    template,
    price,
  };
}
