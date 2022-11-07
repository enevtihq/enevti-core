import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import * as Lisk from 'lisk-sdk';

import { ProfileAPIResponse } from '../../../../../types/core/account/profile';
import { CollectionBase } from '../../../../../types/core/chain/collection';
import { MomentBase } from '../../../../../types/core/chain/moment';
import { NFTBase } from '../../../../../types/core/chain/nft';
import { BASE32_PREFIX } from '../../constant/base32prefix';
import {
  PROFILE_COLLECTION_INITIAL_LENGTH,
  PROFILE_MOMENT_INITIAL_LENGTH,
  PROFILE_OWNED_INITIAL_LENGTH,
} from '../../constant/limit';
import { invokeGetAccount } from '../../utils/invoker/persona_module';
import idBufferToCollection from '../../utils/transformer/idBufferToCollection';
import idBufferToMoment from '../../utils/transformer/idBufferToMoment';
import idBufferToNFT from '../../utils/transformer/idBufferToNFT';
import { minimizeCollection, minimizeNFT } from '../../utils/transformer/minimizeToBase';
import { validateAddress } from '../../utils/validation/address';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { persona, owned, onsale, moment, collection } = req.query as Record<
      string,
      'true' | 'false' | undefined
    >;
    validateAddress(address);

    const { profile, version } = await getProfileEndpoint(
      channel,
      address,
      persona,
      owned,
      onsale,
      moment,
      collection,
    );

    res.status(200).json({ data: profile, version, meta: req.params });
  } catch (err: unknown) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};

export async function getProfileEndpoint(
  channel: BaseChannel,
  address: string,
  persona?: string,
  owned?: string,
  onsale?: string,
  moment?: string,
  collection?: string,
) {
  const account = await invokeGetAccount(channel, address);

  const personaData =
    persona === 'true'
      ? {
          address,
          base32: Lisk.cryptography.getBase32AddressFromAddress(
            Buffer.from(address, 'hex'),
            BASE32_PREFIX,
          ),
          photo: account.persona.photo,
          username: account.persona.username,
        }
      : undefined;

  const ownedDataVersion = owned === 'true' ? account.redeemableNft.owned.length : 0;
  const ownedData =
    owned === 'true'
      ? await Promise.all(
          account.redeemableNft.owned.slice(0, PROFILE_OWNED_INITIAL_LENGTH).map(
            async (item): Promise<NFTBase> => {
              const nft = await idBufferToNFT(channel, item);
              if (!nft)
                throw new Error('NFT not found while iterating account.redeemableNft.owned');
              return minimizeNFT(nft);
            },
          ),
        )
      : [];

  const onSaleDataVersion = onsale === 'true' ? 0 : 0;
  const onSaleData = onsale === 'true' ? [] : [];

  const momentDataVersion = moment === 'true' ? account.redeemableNft.momentCreated.length : 0;
  const momentData =
    moment === 'true'
      ? await Promise.all(
          account.redeemableNft.momentCreated.slice(0, PROFILE_MOMENT_INITIAL_LENGTH).map(
            async (item): Promise<MomentBase> => {
              const momn = await idBufferToMoment(channel, item);
              if (!momn)
                throw new Error(
                  'Moment not found while iterating account.redeemableNft.momentCreated',
                );
              return momn;
            },
          ),
        )
      : [];

  const collectionDataVersion = collection === 'true' ? account.redeemableNft.collection.length : 0;
  const collectionData =
    collection === 'true'
      ? await Promise.all(
          account.redeemableNft.collection.slice(0, PROFILE_COLLECTION_INITIAL_LENGTH).map(
            async (item): Promise<CollectionBase> => {
              const col = await idBufferToCollection(channel, item);
              if (!col)
                throw new Error(
                  'Collection not found while iterating account.redeemableNft.collection',
                );
              return minimizeCollection(col);
            },
          ),
        )
      : [];

  const profile: ProfileAPIResponse = {
    persona: personaData,
    balance: account.token.balance.toString(),
    stake: account.dpos.delegate.totalVotesReceived.toString(),
    social: { twitter: { link: account.persona.social.twitter, stat: 0 } },
    nftSold: account.redeemableNft.nftSold,
    treasuryAct: account.redeemableNft.treasuryAct,
    serveRate: account.redeemableNft.serveRate,
    momentSlot: account.redeemableNft.momentSlot,
    owned: ownedData,
    onSale: onSaleData,
    momentCreated: momentData,
    collection: collectionData,
    pending: account.redeemableNft.pending.length,
    raffled: account.redeemableNft.raffled,
    likeSent: account.redeemableNft.likeSent,
    commentSent: account.redeemableNft.commentSent,
  };

  const version = {
    owned: ownedDataVersion,
    onSale: onSaleDataVersion,
    momentCreated: momentDataVersion,
    collection: collectionDataVersion,
  };

  return { profile, version };
}
