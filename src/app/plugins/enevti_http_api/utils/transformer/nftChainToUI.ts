import { BaseChannel } from 'lisk-framework';
import { NFT, NFTAsset } from '../../../../../types/core/chain/nft';
import addressBufferToPersona from './addressBufferToPersona';
import { invokeGetNFTTemplateById } from '../invoker/redeemable_nft_module';
import chainDateToUI from './chainDateToUI';

export default async function nftChainToUI(channel: BaseChannel, nft: NFTAsset) {
  const redeem: NFT['redeem'] = {
    ...nft.redeem,
    secret: {
      ...nft.redeem.secret,
      sender: nft.redeem.secret.sender.toString('hex'),
      recipient: nft.redeem.secret.recipient.toString('hex'),
    },
    schedule: {
      ...nft.redeem.schedule,
      until: chainDateToUI(nft.redeem.schedule.until),
    },
  };
  const owner: NFT['owner'] = await addressBufferToPersona(channel, nft.owner);
  const creator: NFT['creator'] = await addressBufferToPersona(channel, nft.creator);
  const templateChain = await invokeGetNFTTemplateById(channel, nft.template);
  if (!templateChain) throw new Error('Template not found while processing NFT');
  const template: NFT['template'] = templateChain.data;
  const price: NFT['price'] = {
    amount: nft.price.amount.toString(),
    currency: nft.price.currency,
  };
  const partition: NFT['partition'] = {
    parts: nft.partition.parts.map(item => item.toString('hex')),
    upgradeMaterial: nft.partition.upgradeMaterial,
  };
  return {
    id: nft.id.toString('hex'),
    collectionId: nft.collectionId.toString('hex'),
    networkIdentifier: nft.networkIdentifier.toString('hex'),
    createdOn: chainDateToUI(nft.createdOn),
    partition,
    redeem,
    owner,
    creator,
    template,
    price,
  };
}
