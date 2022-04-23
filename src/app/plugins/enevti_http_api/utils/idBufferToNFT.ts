import { BaseChannel } from 'lisk-framework';
import { NFTAsset, NFT } from '../../../../types/core/chain/nft';
import { NFTActivityChain } from '../../../../types/core/chain/nft/NFTActivity';
import { NFTTemplateAsset } from '../../../../types/core/chain/nft/NFTTemplate';
import { redeemableNFTSchema } from '../../../modules/redeemable_nft/schemas/chain/redeemable_nft';
import addressBufferToPersona from './addressBufferToPersona';

export default async function idBufferToNFT(channel: BaseChannel, id: Buffer): Promise<NFT> {
  const nft = await channel.invoke<NFTAsset>('redeemableNft:getNFT', { id });
  const retNFT = nft ?? ((redeemableNFTSchema.default as unknown) as NFTAsset);
  const activityChain = await channel.invoke<NFTActivityChain>('redeemableNft:getActivityNFT', {
    id,
  });
  const activity = await Promise.all(
    activityChain.items.map(async act => {
      const transaction = act.transaction.toString('hex');
      const to = await addressBufferToPersona(channel, act.to);
      const value = {
        amount: act.value.amount.toString(),
        currency: act.value.currency,
      };
      return { ...act, transaction, to, value };
    }),
  );
  const redeem: NFT['redeem'] = {
    ...retNFT.redeem,
    secret: {
      ...retNFT.redeem.secret,
      sender: retNFT.redeem.secret.sender.toString('hex'),
      recipient: retNFT.redeem.secret.recipient.toString('hex'),
    },
  };
  const owner = await addressBufferToPersona(channel, retNFT.owner);
  const creator = await addressBufferToPersona(channel, retNFT.creator);
  const templateChain = await channel.invoke<NFTTemplateAsset>('redeemableNft:getNFTTemplateById', {
    id: retNFT.template,
  });
  const template = templateChain.data;
  const price = {
    amount: retNFT.price.amount.toString(),
    currency: retNFT.price.currency,
  };
  return {
    ...retNFT,
    id: retNFT.id.toString('hex'),
    collectionId: retNFT.collectionId.toString('hex'),
    activity,
    redeem,
    owner,
    creator,
    template,
    price,
  };
}
