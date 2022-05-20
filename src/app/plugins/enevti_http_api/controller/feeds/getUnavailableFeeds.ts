import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import { FeedItem, Feeds } from '../../../../../types/core/service/feed';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { invokeGetAccount } from '../../utils/hook/persona_module';
import { invokeGetUnavailableCollection } from '../../utils/hook/redeemable_nft_module';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import chainDateToUI from '../../utils/transformer/chainDateToUI';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { offset, limit, version } = req.query as Record<string, string>;
    const unavailableCollections = await invokeGetUnavailableCollection(
      channel,
      offset ? parseInt(offset, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      version ? parseInt(version, 10) : undefined,
    );

    const unavailableFeeds: { checkpoint: number; data: Feeds; version: number } = {
      checkpoint: unavailableCollections.checkpoint,
      version: unavailableCollections.version,
      data: await Promise.all(
        unavailableCollections.data.map(
          async (item): Promise<FeedItem> => {
            const owner = await addressBufferToPersona(channel, item.creator);
            const ownerAccount = await invokeGetAccount(channel, item.creator.toString('hex'));
            const stake = ownerAccount.dpos.delegate.totalVotesReceived.toString();
            let nft: NFT[] = [];
            if (item.collectionType === 'packed') {
              nft = await Promise.all(
                item.minting.total.map(
                  async (nftid): Promise<NFT> => {
                    const nftItem = await idBufferToNFT(channel, nftid);
                    if (!nftItem)
                      throw new Error('NFT not found while iterating collection.minting');
                    return nftItem;
                  },
                ),
              );
            } else {
              const index = Math.floor(item.minting.total.length * Math.random());
              const nftItem = await idBufferToNFT(channel, item.minting.total[index]);
              if (!nftItem) throw new Error('NFT not found while iterating collection.minting');
              nft = [nftItem];
            }
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
              minted: item.stat.minted,
              total: item.minting.total.length,
              expire: chainDateToUI(item.minting.expire),
              nft,
            };
          },
        ),
      ),
    };

    res.status(200).json({ data: unavailableFeeds, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
