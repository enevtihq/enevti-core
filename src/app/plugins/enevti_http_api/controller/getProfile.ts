import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';

import { Profile } from '../../../../types/core/account/profile';
import { NFT } from '../../../../types/core/chain/nft';
import { Collection } from '../../../../types/core/chain/collection';
import idBufferToNFT from '../utils/idBufferToNFT';
import idBufferToCollection from '../utils/idBufferToCollection';
import { invokeGetAccount } from '../utils/hook/persona_module';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const account = await invokeGetAccount(channel, address);

    const ownedAsset = await Promise.all(
      account.redeemableNft.owned.map(
        async (item): Promise<NFT> => {
          const nft = await idBufferToNFT(channel, item);
          if (!nft) throw new Error('NFT not found while iterating account.redeemableNft.owned');
          return nft;
        },
      ),
    );

    const onSaleAsset = await Promise.all(
      account.redeemableNft.onSale.map(
        async (item): Promise<NFT> => {
          const nft = await idBufferToNFT(channel, item);
          if (!nft) throw new Error('NFT not found while iterating account.redeemableNft.onSale');
          return nft;
        },
      ),
    );

    const collectionAsset = await Promise.all(
      account.redeemableNft.collection.map(
        async (item): Promise<Collection> => {
          const collection = await idBufferToCollection(channel, item);
          if (!collection)
            throw new Error(
              'Collection not found while iterating account.redeemableNft.collection',
            );
          return collection;
        },
      ),
    );

    const profile: Profile = {
      balance: account.token.balance.toString(),
      stake: account.dpos.delegate.totalVotesReceived.toString(),
      social: { twitter: { link: '', stat: 0 } },
      nftSold: account.redeemableNft.nftSold,
      treasuryAct: account.redeemableNft.treasuryAct,
      serveRate: account.redeemableNft.serveRate,
      owned: ownedAsset,
      onSale: onSaleAsset,
      collection: collectionAsset,
    };

    res.status(200).json({ data: profile, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: err, meta: req.params });
  }
};
