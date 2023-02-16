import {
  BaseAsset,
  ApplyAssetContext,
  ValidateAssetContext,
  transactions,
  cryptography,
} from 'lisk-sdk';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { CreateOneKindNFTProps } from 'enevti-types/asset/redeemable_nft/create_onekind_nft_asset';
import { CollectionActivityChainItems, CollectionAsset } from 'enevti-types/chain/collection';
import { NFTIdAsset } from 'enevti-types/chain/id';
import { NFTAsset } from 'enevti-types/chain/nft';
import { SocialRaffleGenesisConfig } from 'enevti-types/chain/config/SocialRaffleGenesisConfig';
import { ACTIVITY } from '../constants/activity';
import { NFTTYPE } from '../constants/nft_type';
import { RECURRING } from '../constants/recurring';
import { UTILITY, UTILITY_WITH_SECRET } from '../constants/utility';
import { VALIDATION } from '../constants/validation';
import { createOnekindNftAssetSchema } from '../schemas/asset/create_onekind_nft_asset';
import { addActivityCollection, addActivityProfile } from '../utils/activity';
import { getAllCollection, setAllCollection, setCollectionById } from '../utils/collection';
import { getAllNFTTemplate } from '../utils/nft_template';
import { getAllNFT, setAllNFT, setNFTById } from '../utils/redeemable_nft';
import {
  asyncForEach,
  generateID,
  getBlockTimestamp,
  getNetworkIdentifier,
} from '../utils/transaction';
import { isCollectionEligibleForRaffle } from '../utils/social_raffle';

export class CreateOnekindNftAsset extends BaseAsset<CreateOneKindNFTProps> {
  public name = 'createOnekindNft';
  public id = 0;

  // Define schema for asset
  public schema = createOnekindNftAssetSchema;

  public validate({ asset }: ValidateAssetContext<CreateOneKindNFTProps>): void {
    if (asset.name.length > 20) {
      throw new Error(`asset.name max length is 20`);
    }
    if (asset.description.length > 280) {
      throw new Error(`asset.description max length is 280`);
    }
    if (asset.symbol.length > 10) {
      throw new Error(`asset.symbol max length is 10`);
    }
    if (!Object.values(UTILITY).includes(asset.utility)) {
      throw new Error(`asset.utility is unknown`);
    }
    if (!Object.values(RECURRING).includes(asset.recurring)) {
      throw new Error(`asset.recurring is unknown`);
    }
    if (asset.recurring.length > 8) {
      throw new Error(`asset.recurring max length is 8`);
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
    if (asset.recurring !== RECURRING.ANYTIME && asset.redeemNonceLimit < 0) {
      throw new Error(`asset.redeemNonceLimit can't be negative for non-anytime recurring`);
    }
    if (BigInt(asset.price.amount) < BigInt(0)) {
      throw new Error(`asset.price.amount can't be negative`);
    }
    if (asset.quantity <= 0) {
      throw new Error(`asset.quantity must be greater than 0`);
    }
    if (asset.recurring !== RECURRING.ANYTIME && asset.from.hour < 0) {
      throw new Error(`asset.from.hour can't be negative for non-anytime recurring`);
    }
    if (asset.recurring !== RECURRING.ANYTIME && asset.from.minute < 0) {
      throw new Error(`asset.from.minute can't be negative for non-anytime recurring`);
    }
    if (asset.recurring !== RECURRING.ANYTIME && asset.until <= 0) {
      throw new Error(`asset.until must be greater than 0`);
    }
    if (asset.mintingExpire < 0) {
      throw new Error(`asset.mintingExpire can't be negative`);
    }
    if (asset.royalty.creator < 0) {
      throw new Error(`asset.royalty.creator can't be negative`);
    }
    if (asset.royalty.staker < 0) {
      throw new Error(`asset.royalty.staker can't be negative`);
    }
    if (asset.template.length > VALIDATION.ID_MAXLENGTH) {
      throw new Error(`asset.template max length is ${VALIDATION.ID_MAXLENGTH}`);
    }
    if (asset.data.length > VALIDATION.IPFS_CID_v1_MAXLENGTH) {
      throw new Error(`asset.data max length is ${VALIDATION.IPFS_CID_v1_MAXLENGTH}`);
    }
    if (asset.dataMime.length > VALIDATION.MIME_MAXLENGTH) {
      throw new Error(`asset.dataMime max length is ${VALIDATION.MIME_MAXLENGTH}`);
    }
    if (asset.dataExtension.length > VALIDATION.FILE_EXTENSION_MAXLENGTH) {
      throw new Error(`asset.dataExtension max length is ${VALIDATION.FILE_EXTENSION_MAXLENGTH}`);
    }
    if (asset.dataProtocol.length > VALIDATION.FILE_PROTOCOL_MAXLENGTH) {
      throw new Error(`asset.dataProtocol max length is ${VALIDATION.FILE_PROTOCOL_MAXLENGTH}`);
    }
    if (asset.cover.length > VALIDATION.IPFS_CID_v1_MAXLENGTH) {
      throw new Error(`asset.cover max length is ${VALIDATION.IPFS_CID_v1_MAXLENGTH}`);
    }
    if (asset.coverMime.length > VALIDATION.MIME_MAXLENGTH) {
      throw new Error(`asset.coverMime max length is ${VALIDATION.MIME_MAXLENGTH}`);
    }
    if (asset.coverExtension.length > VALIDATION.FILE_EXTENSION_MAXLENGTH) {
      throw new Error(`asset.coverExtension max length is ${VALIDATION.FILE_EXTENSION_MAXLENGTH}`);
    }
    if (asset.coverProtocol.length > VALIDATION.FILE_PROTOCOL_MAXLENGTH) {
      throw new Error(`asset.coverProtocol max length is ${VALIDATION.FILE_PROTOCOL_MAXLENGTH}`);
    }
    if (asset.content.length > VALIDATION.IPFS_CID_v1_MAXLENGTH) {
      throw new Error(`asset.content max length is ${VALIDATION.ID_MAXLENGTH}`);
    }
    if (asset.contentMime.length > VALIDATION.MIME_MAXLENGTH) {
      throw new Error(`asset.contentMime max length is ${VALIDATION.MIME_MAXLENGTH}`);
    }
    if (asset.contentExtension.length > VALIDATION.FILE_EXTENSION_MAXLENGTH) {
      throw new Error(
        `asset.contentExtension max length is ${VALIDATION.FILE_EXTENSION_MAXLENGTH}`,
      );
    }
    if (asset.contentProtocol.length > VALIDATION.FILE_PROTOCOL_MAXLENGTH) {
      throw new Error(`asset.contentProtocol max length is ${VALIDATION.FILE_PROTOCOL_MAXLENGTH}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
    reducerHandler,
  }: ApplyAssetContext<CreateOneKindNFTProps>): Promise<void> {
    const { senderAddress } = transaction;
    const timestamp = getBlockTimestamp(stateStore);
    const allCollection = await getAllCollection(stateStore);
    const allNFT = await getAllNFT(stateStore);
    const networkIdentifier = getNetworkIdentifier(stateStore);
    const redeemStatus = UTILITY_WITH_SECRET.includes(asset.utility) ? 'pending-secret' : 'ready';

    if (
      asset.utility === 'content' &&
      !cryptography.verifyData(
        cryptography.stringToBuffer(asset.cipher),
        Buffer.from(asset.signature.cipher, 'hex'),
        transaction.senderPublicKey,
      )
    ) {
      throw new Error('secret cipher not verified!');
    }

    const allNFTTemplate = await getAllNFTTemplate(stateStore);
    if (allNFTTemplate.items.includes(asset.template))
      throw new Error('template not exist on chain!');

    const nameRegistrar = await reducerHandler.invoke('registrar:getRegistrar', {
      identifier: 'name',
      value: asset.name,
    });
    if (nameRegistrar) throw new Error('name already exist on chain!');

    const symbolRegistrar = await reducerHandler.invoke('registrar:getRegistrar', {
      identifier: 'symbol',
      value: asset.symbol,
    });
    if (symbolRegistrar) throw new Error('symbol already exist on chain!');

    const totalStake = await reducerHandler.invoke('creatorFinance:getTotalStake', {
      address: senderAddress,
    });
    if ((totalStake as BigInt) < BigInt(transactions.convertLSKToBeddows(VALIDATION.MINSTAKE))) {
      throw new Error(
        `Account needs to have a stake minimum ${VALIDATION.MINSTAKE} coins to be able to create NFT`,
      );
    }

    let idCounter = 0;

    const collection: CollectionAsset = {
      id: generateID(transaction, stateStore, BigInt(idCounter)),
      collectionType: NFTTYPE.ONEKIND,
      mintingType: asset.mintingType,
      cover: {
        cid: asset.cover,
        mime: asset.coverMime,
        extension: asset.coverExtension,
        size: asset.coverSize,
        protocol: asset.coverProtocol,
      },
      name: asset.name,
      description: asset.description,
      symbol: asset.symbol,
      creator: senderAddress,
      createdOn: BigInt(timestamp),
      like: 0,
      comment: 0,
      clubs: 0,
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
      raffled: asset.raffled,
    };

    if (collection.raffled > -1) {
      const config: SocialRaffleGenesisConfig['socialRaffle'] = await reducerHandler.invoke(
        'redeemableNft:getSocialRaffleConfig',
      );
      if (!isCollectionEligibleForRaffle(collection, config)) {
        throw new Error('parameter not eligible for raffle activation');
      }
    }

    idCounter += 1;

    const nftsInThisCollection: NFTAsset[] = [];
    const nftsIdInThisCollection: NFTIdAsset[] = [];
    for (let i = 0; i < asset.quantity; i += 1) {
      const nft: NFTAsset = {
        id: generateID(transaction, stateStore, BigInt(idCounter)),
        collectionId: collection.id,
        symbol: asset.symbol,
        serial: i.toString(),
        name: asset.name,
        description: asset.description,
        createdOn: BigInt(timestamp),
        networkIdentifier,
        like: 0,
        comment: 0,
        clubs: 0,
        owner: Buffer.alloc(0),
        creator: senderAddress,
        data: {
          cid: asset.data,
          mime: asset.dataMime,
          extension: asset.dataExtension,
          size: asset.dataSize,
          protocol: asset.dataProtocol,
        },
        template: asset.template,
        nftType: NFTTYPE.ONEKIND,
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
          nonce: 0,
          velocity: 0,
          nonceLimit: asset.redeemNonceLimit,
          countLimit: asset.redeemCountLimit,
          secret: {
            cipher: asset.cipher,
            signature: {
              cipher: asset.signature.cipher,
              plain: asset.signature.plain,
            },
            sender: transaction.senderPublicKey,
            recipient: transaction.senderPublicKey,
          },
          content: {
            cid: asset.content,
            mime: asset.contentMime,
            extension: asset.contentExtension,
            size: asset.contentSize,
            protocol: asset.contentProtocol,
            security: asset.contentSecurity,
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
      idCounter += 1;
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
    await reducerHandler.invoke('registrar:setRegistrar', {
      identifier: 'name',
      value: collection.name,
      id: collection.id,
    });
    await reducerHandler.invoke('registrar:setRegistrar', {
      identifier: 'symbol',
      value: collection.symbol,
      id: collection.id,
    });
    await asyncForEach(nftsInThisCollection, async item => {
      await reducerHandler.invoke('registrar:setRegistrar', {
        identifier: 'symbol',
        value: `${item.symbol}#${item.serial}`,
        id: item.id,
      });
    });

    const activity: CollectionActivityChainItems = {
      transaction: transaction.id,
      name: ACTIVITY.COLLECTION.CREATED,
      date: BigInt(timestamp),
      nfts: [],
      to: senderAddress,
      value: {
        amount: BigInt(0),
        currency: asset.price.currency,
      },
    };
    await addActivityCollection(stateStore, collection.id.toString('hex'), activity);

    await addActivityProfile(stateStore, senderAddress.toString('hex'), {
      transaction: transaction.id,
      name: ACTIVITY.PROFILE.CREATENFT,
      date: BigInt(timestamp),
      from: senderAddress,
      to: Buffer.alloc(0),
      payload: collection.id,
      value: {
        amount: BigInt(0),
        currency: asset.price.currency,
      },
    });

    const senderAccount = await stateStore.account.get<RedeemableNFTAccountProps>(senderAddress);
    senderAccount.redeemableNft.collection.unshift(collection.id);
    await stateStore.account.set(senderAddress, senderAccount);
  }
}
