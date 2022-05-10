import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import { FeedItem, Feeds } from '../../../../../types/core/service/feed';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { invokeGetAccount } from '../../utils/hook/persona_module';
import { invokeGetAvailableCollection } from '../../utils/hook/redeemable_nft_module';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.query as Record<string, string>;
    const availableCollections = await invokeGetAvailableCollection(
      channel,
      parseInt(offset, 10),
      parseInt(limit, 10),
    );

    const availableFeeds: { offset: number; data: Feeds } = {
      offset: availableCollections.offset,
      data: await Promise.all(
        availableCollections.data.map(
          async (item): Promise<FeedItem> => {
            const owner = await addressBufferToPersona(channel, item.creator);
            const ownerAccount = await invokeGetAccount(channel, item.creator.toString('hex'));
            const stake = ownerAccount.dpos.delegate.totalVotesReceived.toString();
            const nft = await Promise.all(
              item.minting.total.map(
                async (nftid): Promise<NFT> => {
                  const nftItem = await idBufferToNFT(channel, nftid);
                  if (!nftItem) throw new Error('NFT not found while iterating collection.minting');
                  return nftItem;
                },
              ),
            );
            return {
              type: item.collectionType,
              id: item.id.toString('hex'),
              like: item.like,
              comment: item.comment,
              price: {
                amount: item.minting.price.amount.toString(),
                currency: item.minting.price.currency,
              },
              name: item.name,
              description: item.description,
              promoted: item.promoted,
              owner,
              stake,
              delegate: !!ownerAccount.dpos.delegate.username,
              nft,
            };
          },
        ),
      ),
    };

    res.status(200).json({ data: availableFeeds, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};