import { BlockHeader } from '@liskhq/lisk-chain';
import { AfterBlockApplyContext, Transaction } from 'lisk-framework';
import { BaseModuleChannel } from 'lisk-framework/dist-node/modules';
import { apiClient, cryptography } from 'lisk-sdk';
import { RedeemableNFTAccountProps } from '../../../../../types/core/account/profile';
import { DeliverSecretProps } from '../../../../../types/core/asset/redeemable_nft/deliver_secret_asset';
import { LikeCollectionProps } from '../../../../../types/core/asset/redeemable_nft/like_collection_asset';
import { LikeNFTProps } from '../../../../../types/core/asset/redeemable_nft/like_nft_asset';
import { MintNFTProps } from '../../../../../types/core/asset/redeemable_nft/mint_nft_asset';
import {
  MintNFTByQRProps,
  MintNFTByQR,
} from '../../../../../types/core/asset/redeemable_nft/mint_nft_type_qr_asset';
import { ACTIVITY } from '../../constants/activity';
import { COIN_NAME } from '../../constants/chain';
import { addActivityProfile } from '../../utils/activity';
import { getCollectionById } from '../../utils/collection';
import { collectionMintingAvailabilityMonitor } from './collectionMintingAvailabilityMonitor';
import { socialRaffleMonitor } from './socialRaffleMonitor';
import { getNFTById } from '../../utils/redeemable_nft';
import { asyncForEach, addInObject } from '../../utils/transaction';
import { SocialRaffleGenesisConfig } from '../../../../../types/core/chain/config/SocialRaffleGenesisConfig';

export default async function redeemableNftAfterBlockApply(
  input: AfterBlockApplyContext,
  channel: BaseModuleChannel,
  config: Record<string, unknown>,
  client: apiClient.APIClient,
) {
  await collectionMintingAvailabilityMonitor(input);

  const prevBlock = (await client.block.get(input.block.header.previousBlockID)) as {
    header: BlockHeader;
    payload: Transaction[];
  };
  const timestampBlock = (await client.block.get(
    prevBlock.header.previousBlockID.length > 0
      ? prevBlock.header.previousBlockID
      : input.block.header.previousBlockID,
  )) as {
    header: BlockHeader;
    payload: Transaction[];
  };

  const accountWithNewCollection: Set<Buffer> = new Set<Buffer>();
  const accountWithNewPending: Set<Buffer> = new Set<Buffer>();
  const accountWithNewActivity: Set<Buffer> = new Set<Buffer>();
  const pendingNFTBuffer: Set<Buffer> = new Set<Buffer>();
  const collectionWithNewActivity: Set<Buffer> = new Set<Buffer>();
  const collectionWithNewLike: Set<Buffer> = new Set<Buffer>();
  const nftWithNewActivity: Set<Buffer> = new Set<Buffer>();
  const nftWithNewLike: Set<Buffer> = new Set<Buffer>();
  const totalNftMintedInCollection: { [collection: string]: number } = {};
  const totalCollectionCreatedByAddress: { [address: string]: number } = {};

  await socialRaffleMonitor(
    input,
    config as SocialRaffleGenesisConfig,
    channel,
    collectionWithNewActivity,
    accountWithNewActivity,
    totalNftMintedInCollection,
    pendingNFTBuffer,
    accountWithNewPending,
  );

  for (const payload of prevBlock.payload) {
    const senderAddress = cryptography.getAddressFromPublicKey(payload.senderPublicKey);

    // transferAsset
    if (payload.moduleID === 2 && payload.assetID === 0) {
      const transferAsset = (payload.asset as unknown) as {
        amount: bigint;
        recipientAddress: Buffer;
      };

      await addActivityProfile(input.stateStore, senderAddress.toString('hex'), {
        transaction: payload.id,
        name: ACTIVITY.PROFILE.TOKENSENT,
        date: BigInt(timestampBlock.header.timestamp),
        from: senderAddress,
        to: transferAsset.recipientAddress,
        payload: Buffer.alloc(0),
        value: {
          amount: transferAsset.amount,
          currency: COIN_NAME,
        },
      });
      accountWithNewActivity.add(senderAddress);

      await addActivityProfile(input.stateStore, transferAsset.recipientAddress.toString('hex'), {
        transaction: payload.id,
        name: ACTIVITY.PROFILE.TOKENRECEIVED,
        date: BigInt(timestampBlock.header.timestamp),
        from: senderAddress,
        to: transferAsset.recipientAddress,
        payload: Buffer.alloc(0),
        value: {
          amount: transferAsset.amount,
          currency: COIN_NAME,
        },
      });
      accountWithNewActivity.add(transferAsset.recipientAddress);
    }

    // registerTransactionAsset
    if (payload.moduleID === 5 && payload.assetID === 0) {
      const registerBaseFee = await input.reducerHandler.invoke('dynamicBaseFee:getBaseFee', {
        transaction: payload,
      });
      await addActivityProfile(input.stateStore, senderAddress.toString('hex'), {
        transaction: payload.id,
        name: ACTIVITY.PROFILE.REGISTERUSERNAME,
        date: BigInt(timestampBlock.header.timestamp),
        from: senderAddress,
        to: Buffer.alloc(0),
        payload: Buffer.alloc(0),
        value: {
          amount: registerBaseFee as bigint,
          currency: COIN_NAME,
        },
      });
      accountWithNewActivity.add(senderAddress);
    }

    // voteTransactionAsset
    if (payload.moduleID === 5 && payload.assetID === 1) {
      const voteAsset = (payload.asset as unknown) as {
        votes: { delegateAddress: Buffer; amount: bigint }[];
      };
      await asyncForEach(voteAsset.votes, async item => {
        await addActivityProfile(input.stateStore, senderAddress.toString('hex'), {
          transaction: payload.id,
          name:
            Buffer.compare(senderAddress, item.delegateAddress) === 0
              ? ACTIVITY.PROFILE.SELFSTAKE
              : ACTIVITY.PROFILE.ADDSTAKE,
          date: BigInt(timestampBlock.header.timestamp),
          from: senderAddress,
          to: item.delegateAddress,
          payload: Buffer.alloc(0),
          value: {
            amount: item.amount,
            currency: COIN_NAME,
          },
        });
      });
      accountWithNewActivity.add(senderAddress);
    }

    // createNftAsset
    if (payload.moduleID === 1000 && payload.assetID === 0) {
      accountWithNewCollection.add(senderAddress);
      accountWithNewActivity.add(senderAddress);
      addInObject(totalCollectionCreatedByAddress, senderAddress, 1);
    }

    // mintNftAsset
    if (payload.moduleID === 1000 && payload.assetID === 1) {
      const mintNFTAsset = (payload.asset as unknown) as MintNFTProps;
      const collection = await getCollectionById(input.stateStore, mintNFTAsset.id);
      if (!collection) throw new Error('Collection not found in AfterBlockApply hook');

      collectionWithNewActivity.add(collection.id);
      accountWithNewActivity.add(senderAddress);
      addInObject(totalNftMintedInCollection, collection.id, mintNFTAsset.quantity);
    }

    // deliverSecretAsset
    if (payload.moduleID === 1000 && payload.assetID === 2) {
      const deliverSecretAsset = (payload.asset as unknown) as DeliverSecretProps;
      const nft = await getNFTById(input.stateStore, deliverSecretAsset.id);
      if (!nft) throw new Error('nft id not found in afterBlockApply hook');

      collectionWithNewActivity.add(nft.collectionId);
      nftWithNewActivity.add(nft.id);
      accountWithNewPending.add(nft.creator);
      accountWithNewActivity.add(nft.creator);

      channel.publish('redeemableNft:secretDelivered', {
        nft: deliverSecretAsset.id,
      });
    }

    // mintNftTypeQrAsset
    if (payload.moduleID === 1000 && payload.assetID === 3) {
      const mintNFTAsset = (payload.asset as unknown) as MintNFTByQRProps;
      const plainPayload = Buffer.from(mintNFTAsset.body, 'base64').toString();
      const { id, quantity } = JSON.parse(plainPayload) as MintNFTByQR;

      const collection = await getCollectionById(input.stateStore, id);
      if (!collection) throw new Error('Collection not found in AfterBlockApply hook');

      collectionWithNewActivity.add(collection.id);
      accountWithNewActivity.add(senderAddress);
      addInObject(totalNftMintedInCollection, collection.id, quantity);
    }

    // likeNFtAsset
    if (payload.moduleID === 1000 && payload.assetID === 4) {
      const likeNftAsset = (payload.asset as unknown) as LikeNFTProps;
      nftWithNewLike.add(Buffer.from(likeNftAsset.id, 'hex'));
    }

    // likeCollectionAsset
    if (payload.moduleID === 1000 && payload.assetID === 5) {
      const likeCollectionAsset = (payload.asset as unknown) as LikeCollectionProps;
      collectionWithNewLike.add(Buffer.from(likeCollectionAsset.id, 'hex'));
    }
  }

  await asyncForEach(Object.keys(totalCollectionCreatedByAddress), async address => {
    const account = await input.stateStore.account.get<RedeemableNFTAccountProps>(
      Buffer.from(address, 'hex'),
    );
    account.redeemableNft.collection
      .slice(0, totalCollectionCreatedByAddress[address])
      .forEach(collection => collectionWithNewActivity.add(collection));
  });

  await asyncForEach(Object.keys(totalNftMintedInCollection), async collectionId => {
    const collection = await getCollectionById(input.stateStore, collectionId);
    if (!collection) throw new Error('Collection not found in AfterBlockApply hook');

    collection.minted
      .slice(0, totalNftMintedInCollection[collectionId])
      .forEach(nft => nftWithNewActivity.add(nft));

    channel.publish('redeemableNft:newNFTMinted', {
      collection: collection.id.toString('hex'),
      quantity: totalNftMintedInCollection[collectionId],
    });

    channel.publish('redeemableNft:totalNFTSoldChanged', {
      address: collection.creator.toString('hex'),
    });

    const creatorAccount = await input.stateStore.account.get<RedeemableNFTAccountProps>(
      collection.creator,
    );
    if (creatorAccount.redeemableNft.pending.length > 0) {
      creatorAccount.redeemableNft.pending.forEach(nft => pendingNFTBuffer.add(nft));
      accountWithNewPending.add(collection.creator);
    }
  });

  if (accountWithNewPending.size > 0) {
    accountWithNewPending.forEach(address => {
      channel.publish('redeemableNft:newPendingByAddress', {
        address: address.toString('hex'),
      });
      channel.publish('redeemableNft:totalServeRateChanged', {
        address: address.toString('hex'),
      });
    });
  }

  if (accountWithNewCollection.size > 0) {
    channel.publish('redeemableNft:newCollection');
    accountWithNewCollection.forEach(address =>
      channel.publish('redeemableNft:newCollectionByAddress', {
        address: address.toString('hex'),
        count: totalCollectionCreatedByAddress[address.toString('hex')],
      }),
    );
  }

  if (collectionWithNewActivity.size > 0) {
    collectionWithNewActivity.forEach(collection =>
      channel.publish('redeemableNft:newActivityCollection', {
        collection: collection.toString('hex'),
        timestamp: timestampBlock.header.timestamp,
      }),
    );
  }

  if (nftWithNewActivity.size > 0) {
    nftWithNewActivity.forEach(nft =>
      channel.publish('redeemableNft:newActivityNFT', {
        nft: nft.toString('hex'),
        timestamp: timestampBlock.header.timestamp,
      }),
    );
  }

  if (accountWithNewActivity.size > 0) {
    accountWithNewActivity.forEach(address =>
      channel.publish('redeemableNft:newActivityProfile', {
        address: address.toString('hex'),
        timestamp: timestampBlock.header.timestamp,
      }),
    );
  }

  if (pendingNFTBuffer.size > 0) {
    channel.publish('redeemableNft:pendingUtilityDelivery', {
      nfts: [...pendingNFTBuffer],
    });
  }

  if (nftWithNewLike.size > 0) {
    nftWithNewLike.forEach(nft =>
      channel.publish('redeemableNft:newNFTLike', { id: nft.toString('hex') }),
    );
  }

  if (collectionWithNewLike.size > 0) {
    collectionWithNewLike.forEach(nft =>
      channel.publish('redeemableNft:newCollectionLike', { id: nft.toString('hex') }),
    );
  }
}
