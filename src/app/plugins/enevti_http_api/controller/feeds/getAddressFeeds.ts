import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import { FeedItem, Feeds, HomeFeeds } from '../../../../../types/core/service/feed';
import addressBufferToPersona from '../../utils/transformer/addressBufferToPersona';
import { invokeGetAccount } from '../../utils/invoker/persona_module';
import {
  invokeGetAllCollection,
  invokeGetAllMoment,
  invokeGetLiked,
} from '../../utils/invoker/redeemable_nft_module';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import chainDateToUI from '../../utils/transformer/chainDateToUI';
import { MomentBase } from '../../../../../types/core/chain/moment';
import { getProfileEndpoint } from '../profile/getProfile';
import { validateAddress } from '../../utils/validation/address';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { offset, limit, version, viewer } = req.query as Record<string, string>;

    validateAddress(address);
    const collections = await invokeGetAllCollection(
      channel,
      offset ? parseInt(offset, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      version ? parseInt(version, 10) : undefined,
    );

    const collectionFeeds: { checkpoint: number; data: Feeds; version: number } = {
      checkpoint: collections.checkpoint,
      version: collections.version,
      data: await Promise.all(
        collections.data.map(
          async (item): Promise<FeedItem> => {
            const liked = viewer
              ? (await invokeGetLiked(channel, item.id.toString('hex'), viewer)) === 1
              : false;
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
              liked,
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

    const moments = await invokeGetAllMoment(
      channel,
      offset ? parseInt(offset, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      version ? parseInt(version, 10) : undefined,
    );

    const momentsFeeds: { checkpoint: number; data: MomentBase[]; version: number } = {
      checkpoint: moments.checkpoint,
      version: moments.version,
      data: await Promise.all(
        moments.data.map(
          (item): MomentBase => ({
            id: item.id.toString('hex'),
            cover: item.cover,
          }),
        ),
      ),
    };

    const homeFeeds: HomeFeeds = {
      profile: await getProfileEndpoint(channel, address, 'true', 'true', 'true', 'true', 'true'),
      feed: collectionFeeds,
      moment: momentsFeeds,
    };

    res.status(200).json({ data: homeFeeds, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
