import { DPOSAccountProps } from 'lisk-framework/dist-node/modules/dpos';
import { BaseAsset, ApplyAssetContext, ValidateAssetContext, transactions } from 'lisk-sdk';

import { ACTIVITY } from '../constants/activity';
import { NFTTYPE } from '../constants/nft_type';
import { RECURRING } from '../constants/recurring';
import { UTILITY, UTILITY_WITH_SECRET } from '../constants/utility';
import { VALIDATION } from '../constants/validation';
import { createOnekindNftAssetSchema } from '../schemas/asset/create_onekind_nft_asset';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';
import { CreateOneKindNFTProps } from '../../../../types/core/asset/redeemable_nft/create_onekind_nft_asset';
import {
  CollectionActivityChainItems,
  CollectionAsset,
} from '../../../../types/core/chain/collection';
import { NFTIdAsset } from '../../../../types/core/chain/id';
import { NFTAsset } from '../../../../types/core/chain/nft';
import { addActivityCollection } from '../utils/activity';
import { getAllCollection, setAllCollection, setCollectionById } from '../utils/collection';
import { getAllNFTTemplate } from '../utils/nft_template';
import { getAllNFT, setAllNFT, setNFTById } from '../utils/redeemable_nft';
import {
  getRegisteredName,
  getRegisteredSymbol,
  setRegisteredName,
  setRegisteredSerial,
  setRegisteredSymbol,
} from '../utils/registrar';
import {
  asyncForEach,
  generateID,
  getBlockTimestamp,
  getNetworkIdentifier,
} from '../utils/transaction';

export class CreateOnekindNftAsset extends BaseAsset<CreateOneKindNFTProps> {
  public name = 'createOnekindNft';
  public id = 0;

  // Define schema for asset
  public schema = createOnekindNftAssetSchema;

  public validate({ asset }: ValidateAssetContext<CreateOneKindNFTProps>): void {
    if (!Object.values(UTILITY).includes(asset.utility)) {
      throw new Error(`asset.utility is unknown`);
    }
    if (!Object.values(RECURRING).includes(asset.recurring)) {
      throw new Error(`asset.recurring is unknown`);
    }
    if (asset.recurring === RECURRING.WEEKLY && asset.time.day < 0) {
      throw new Error(`asset.time.day is required on recurring perweek`);
    }
    if (asset.recurring === RECURRING.MONTHLY && asset.time.date <= 0) {
      throw new Error(`asset.time.date is required on recurring permonth`);
    }
    if (asset.recurring === RECURRING.YEARLY && (asset.time.date <= 0 || asset.time.month <= 0)) {
      throw new Error(`asset.time.date and asset.time.month are required on recurring peryear`);
    }
    if (
      asset.recurring === RECURRING.ONCE &&
      (asset.time.date <= 0 || asset.time.month <= 0 || asset.time.year <= 0)
    ) {
      throw new Error(
        `asset.time.date, asset.time.month, and asset.time.year are required on recurring once`,
      );
    }
    if (asset.redeemLimit <= 0) {
      throw new Error(`asset.redeemLimit must be greater than 0`);
    }
    if (BigInt(asset.price.amount) < BigInt(0)) {
      throw new Error(`asset.price.amount can't be negative`);
    }
    if (asset.quantity <= 0) {
      throw new Error(`asset.quantity must be greater than 0`);
    }
    if (asset.from.hour < 0) {
      throw new Error(`asset.from.hour can't be negative`);
    }
    if (asset.from.minute < 0) {
      throw new Error(`asset.from.minute can't be negative`);
    }
    if (asset.until <= 0) {
      throw new Error(`asset.quantity must be greater than 0`);
    }
    if (asset.mintingExpire < -1 || asset.mintingExpire === 0) {
      throw new Error(`asset.mintingExpire can only be -1, or greater than 0`);
    }
    if (asset.royalty.creator < 0) {
      throw new Error(`asset.royalty.origin can't be negative`);
    }
    if (asset.royalty.staker < 0) {
      throw new Error(`asset.royalty.staker can't be negative`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<CreateOneKindNFTProps>): Promise<void> {
    const { senderAddress } = transaction;
    const timestamp = getBlockTimestamp(stateStore);
    const allCollection = await getAllCollection(stateStore);
    const allNFT = await getAllNFT(stateStore);
    const networkIdentifier = getNetworkIdentifier(stateStore);
    const redeemStatus = UTILITY_WITH_SECRET.includes(asset.utility) ? 'pending-secret' : 'ready';

    const allNFTTemplate = await getAllNFTTemplate(stateStore);
    if (allNFTTemplate.items.includes(asset.template))
      throw new Error('template not exist on chain!');

    const nameRegistrar = await getRegisteredName(stateStore, asset.name);
    if (nameRegistrar) throw new Error('name already exist on chain!');

    const symbolRegistrar = await getRegisteredSymbol(stateStore, asset.symbol);
    if (symbolRegistrar) throw new Error('symbol already exist on chain!');

    const senderAccount = await stateStore.account.get<
      DPOSAccountProps & RedeemableNFTAccountProps
    >(senderAddress);
    if (
      senderAccount.dpos.delegate.totalVotesReceived <
      BigInt(transactions.convertLSKToBeddows(VALIDATION.MINVOTE))
    ) {
      throw new Error(
        `Account needs to have a stake minimum ${VALIDATION.MINVOTE} coins to be able to create NFT`,
      );
    }

    const collection: CollectionAsset = {
      id: generateID(senderAddress, transaction.nonce),
      collectionType: NFTTYPE.ONEKIND,
      cover: {
        cid: asset.cover,
        mime: asset.coverMime,
        extension: asset.coverExtension,
        size: asset.coverSize,
      },
      name: asset.name,
      description: asset.description,
      symbol: asset.symbol,
      creator: senderAddress,
      createdOn: timestamp,
      like: 0,
      comment: 0,
      packSize: 1,
      stat: {
        minted: 0,
        owner: [],
        redeemed: 0,
        floor: {
          amount: asset.price.amount,
          currency: asset.price.currency,
        },
        volume: {
          amount: BigInt(0),
          currency: asset.price.currency,
        },
      },
      minting: {
        total: [],
        available: [],
        expire: asset.mintingExpire,
        price: {
          amount: asset.price.amount,
          currency: asset.price.currency,
        },
      },
      minted: [],
      social: {
        twitter: '',
      },
      promoted: false,
    };

    const nftsInThisCollection: NFTAsset[] = [];
    const nftsIdInThisCollection: NFTIdAsset[] = [];
    for (let i = 0; i < asset.quantity; i += 1) {
      const nft: NFTAsset = {
        id: generateID(senderAddress, transaction.nonce + BigInt(i + 1)),
        collectionId: collection.id,
        symbol: asset.symbol,
        serial: i.toString(),
        name: asset.name,
        description: asset.description,
        createdOn: timestamp,
        networkIdentifier,
        like: 0,
        comment: 0,
        owner: Buffer.alloc(0),
        creator: senderAddress,
        data: {
          cid: asset.data,
          mime: asset.dataMime,
          extension: asset.dataExtension,
          size: asset.dataSize,
        },
        template: asset.template,
        NFTType: NFTTYPE.ONEKIND,
        utility: asset.utility,
        rarity: {
          stat: { rank: -1, percent: -1 },
          trait: [{ key: 'utility', value: asset.utility }],
        },
        partition: {
          parts: [],
          upgradeMaterial: 0,
        },
        redeem: {
          status: redeemStatus,
          count: 0,
          limit: asset.redeemLimit,
          touched: timestamp,
          secret: {
            cipher: asset.cipher,
            signature: asset.signature,
            sender: transaction.senderPublicKey,
            recipient: transaction.senderPublicKey,
          },
          content: {
            cid: asset.content,
            mime: asset.contentMime,
            extension: asset.contentExtension,
            size: asset.contentSize,
            iv: asset.contentIv,
            salt: asset.contentSalt,
            version: asset.contentSecurityVersion,
          },
          schedule: {
            recurring: asset.recurring,
            time: {
              day: asset.time.day,
              date: asset.time.date,
              month: asset.time.month,
              year: asset.time.year,
            },
            from: {
              hour: asset.from.hour,
              minute: asset.from.minute,
            },
            until: asset.until,
          },
        },
        price: {
          amount: asset.price.amount,
          currency: asset.price.currency,
        },
        onSale: false,
        royalty: {
          creator: asset.royalty.creator,
          staker: asset.royalty.staker,
        },
      };
      nftsInThisCollection.unshift(nft);
      nftsIdInThisCollection.unshift(nft.id);
      allNFT.items.unshift(nft.id);
    }

    await setAllNFT(stateStore, allNFT);
    await asyncForEach<NFTAsset>(nftsInThisCollection, async item => {
      await setNFTById(stateStore, item.id.toString('hex'), item);
    });

    collection.minting.total = nftsIdInThisCollection;
    collection.minting.available = nftsIdInThisCollection;

    allCollection.items.unshift(collection.id);
    await setAllCollection(stateStore, allCollection);

    await setCollectionById(stateStore, collection.id.toString('hex'), collection);
    await setRegisteredName(stateStore, collection.name, collection.id.toString('hex'));
    await setRegisteredSymbol(stateStore, collection.symbol, collection.id.toString('hex'));
    await asyncForEach(nftsInThisCollection, async item => {
      await setRegisteredSerial(
        stateStore,
        `${item.symbol}#${item.serial}`,
        item.id.toString('hex'),
      );
    });

    const activity: CollectionActivityChainItems = {
      transaction: transaction.id,
      name: ACTIVITY.COLLECTION.CREATED,
      date: timestamp,
      nfts: [],
      to: senderAddress,
      value: {
        amount: BigInt(0),
        currency: asset.price.currency,
      },
    };
    await addActivityCollection(stateStore, collection.id.toString('hex'), activity);

    senderAccount.redeemableNft.collection.unshift(collection.id);
    await stateStore.account.set(senderAddress, senderAccount);
  }
}
