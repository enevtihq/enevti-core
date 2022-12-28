import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { NFT } from '../../../../../types/core/chain/nft';
import { FeedItem, HomeFeeds } from '../../../../../types/core/service/feed';
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
import idBufferToMoment from '../../utils/transformer/idBufferToMoment';
import { minimizeMoment } from '../../utils/transformer/minimizeToBase';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { collection, moment, viewer } = req.query as Record<string, string>;

    validateAddress(address);
    const collections = await invokeGetAllCollection(
      channel,
      0,
      collection ? parseInt(collection, 10) : undefined,
      undefined,
    );

    const collectionFeeds = await Promise.all(
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
                  if (!nftItem) throw new Error('NFT not found while iterating collection.minting');
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
    );

    const moments = await invokeGetAllMoment(
      channel,
      0,
      moment ? parseInt(moment, 10) : undefined,
      undefined,
    );

    const momentsFeeds: MomentBase[] = await Promise.all(
      moments.data.map(
        async (item): Promise<MomentBase> => {
          const data = await idBufferToMoment(channel, item.id);
          if (!data) throw new Error('Error while iterating allMoments.data');
          const liked = viewer
            ? (await invokeGetLiked(channel, item.id.toString('hex'), viewer)) === 1
            : false;
          return {
            ...minimizeMoment(data),
            liked,
          };
        },
      ),
    );

    const profileEndpoint = await getProfileEndpoint(
      channel,
      address,
      'true',
      '0',
      '0',
      '0',
      '0',
      viewer,
    );

    const homeFeeds: HomeFeeds = {
      profile: profileEndpoint.profile,
      feed: collectionFeeds,
      moment: momentsFeeds,
    };

    const homeVersion = {
      profile: profileEndpoint.version,
      feed: collections.version,
      moment: moments.version,
    };

    res.status(200).json({ data: homeFeeds, version: homeVersion, meta: req.query });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.query });
  }
};
