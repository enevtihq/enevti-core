import { AfterBlockApplyContext } from 'lisk-framework';
import { BaseModuleChannel } from 'lisk-framework/dist-node/modules';
import { codec, cryptography } from 'lisk-sdk';
import { VoteTransactionAsset } from 'lisk-framework/dist-node/modules/dpos';
import { TransferAsset } from 'lisk-framework/dist-node/modules/token';
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
import { CommentNFTProps } from '../../../../../types/core/asset/redeemable_nft/comment_nft_asset';
import { CommentCollectionProps } from '../../../../../types/core/asset/redeemable_nft/comment_collection_asset';
import { mintNftAssetSchema } from '../../schemas/asset/mint_nft_asset';
import { deliverSecretAssetSchema } from '../../schemas/asset/deliver_secret_asset';
import { mintNftTypeQrAssetSchema } from '../../schemas/asset/mint_nft_type_qr_asset';
import { likeNftAssetSchema } from '../../schemas/asset/like_nft_asset';
import { likeCollectionAssetSchema } from '../../schemas/asset/like_collection_asset';
import { commentNftAssetSchema } from '../../schemas/asset/comment_nft_asset';
import { commentCollectionAssetSchema } from '../../schemas/asset/comment_collection_asset';
import { SetVideoCallRejectedProps } from '../../../../../types/core/asset/redeemable_nft/set_video_call_rejected_asset';
import { setVideoCallRejectedAssetSchema } from '../../schemas/asset/set_video_call_rejected_asset';
import { SetVideoCallAnsweredProps } from '../../../../../types/core/asset/redeemable_nft/set_video_call_answered_asset';
import { setVideoCallAnsweredAssetSchema } from '../../schemas/asset/set_video_call_answered_asset';

export default async function redeemableNftAfterBlockApply(
  input: AfterBlockApplyContext,
  channel: BaseModuleChannel,
  config: Record<string, unknown>,
) {
  await collectionMintingAvailabilityMonitor(input);
  const timestampBlock = input.stateStore.chain.lastBlockHeaders[0];

  const accountWithNewCollection: Set<string> = new Set<string>();
  const accountWithNewPending: Set<string> = new Set<string>();
  const accountWithNewMomentSlot: Set<string> = new Set<string>();
  const accountWithNewActivity: Set<string> = new Set<string>();
  const pendingNFTBuffer: Set<string> = new Set<string>();
  const collectionWithNewActivity: Set<string> = new Set<string>();
  const collectionWithNewLike: Set<string> = new Set<string>();
  const collectionWithNewComment: Set<string> = new Set<string>();
  const nftWithNewActivity: Set<string> = new Set<string>();
  const nftWithNewLike: Set<string> = new Set<string>();
  const nftWithNewComment: Set<string> = new Set<string>();
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

  for (const payload of input.block.payload) {
    const senderAddress = cryptography.getAddressFromPublicKey(payload.senderPublicKey);

    // transferAsset
    if (payload.moduleID === 2 && payload.assetID === 0) {
      const transferAsset = codec.decode<{
        amount: bigint;
        recipientAddress: Buffer;
      }>(new TransferAsset(BigInt(0)).schema, payload.asset);

      await addActivityProfile(input.stateStore, senderAddress.toString('hex'), {
        transaction: payload.id,
        name: ACTIVITY.PROFILE.TOKENSENT,
        date: BigInt(timestampBlock.timestamp),
        from: senderAddress,
        to: transferAsset.recipientAddress,
        payload: Buffer.alloc(0),
        value: {
          amount: transferAsset.amount,
          currency: COIN_NAME,
        },
      });
      accountWithNewActivity.add(senderAddress.toString('hex'));

      await addActivityProfile(input.stateStore, transferAsset.recipientAddress.toString('hex'), {
        transaction: payload.id,
        name: ACTIVITY.PROFILE.TOKENRECEIVED,
        date: BigInt(timestampBlock.timestamp),
        from: senderAddress,
        to: transferAsset.recipientAddress,
        payload: Buffer.alloc(0),
        value: {
          amount: transferAsset.amount,
          currency: COIN_NAME,
        },
      });
      accountWithNewActivity.add(transferAsset.recipientAddress.toString('hex'));
    }

    // registerTransactionAsset
    if (payload.moduleID === 5 && payload.assetID === 0) {
      const registerBaseFee = await input.reducerHandler.invoke('dynamicBaseFee:getBaseFee', {
        transaction: payload,
      });
      await addActivityProfile(input.stateStore, senderAddress.toString('hex'), {
        transaction: payload.id,
        name: ACTIVITY.PROFILE.REGISTERUSERNAME,
        date: BigInt(timestampBlock.timestamp),
        from: senderAddress,
        to: Buffer.alloc(0),
        payload: Buffer.alloc(0),
        value: {
          amount: registerBaseFee as bigint,
          currency: COIN_NAME,
        },
      });
      accountWithNewActivity.add(senderAddress.toString('hex'));
    }

    // voteTransactionAsset
    if (payload.moduleID === 5 && payload.assetID === 1) {
      const voteAsset = codec.decode<{
        votes: { delegateAddress: Buffer; amount: bigint }[];
      }>(new VoteTransactionAsset().schema, payload.asset);

      await asyncForEach(voteAsset.votes, async item => {
        await addActivityProfile(input.stateStore, senderAddress.toString('hex'), {
          transaction: payload.id,
          name:
            Buffer.compare(senderAddress, item.delegateAddress) === 0
              ? ACTIVITY.PROFILE.SELFSTAKE
              : ACTIVITY.PROFILE.ADDSTAKE,
          date: BigInt(timestampBlock.timestamp),
          from: senderAddress,
          to: item.delegateAddress,
          payload: Buffer.alloc(0),
          value: {
            amount: item.amount,
            currency: COIN_NAME,
          },
        });
      });
      accountWithNewActivity.add(senderAddress.toString('hex'));
    }

    // createNftAsset
    if (payload.moduleID === 1000 && payload.assetID === 0) {
      accountWithNewCollection.add(senderAddress.toString('hex'));
      accountWithNewActivity.add(senderAddress.toString('hex'));
      addInObject(totalCollectionCreatedByAddress, senderAddress, 1);
    }

    // mintNftAsset
    if (payload.moduleID === 1000 && payload.assetID === 1) {
      const mintNFTAsset = codec.decode<MintNFTProps>(mintNftAssetSchema, payload.asset);
      const collection = await getCollectionById(input.stateStore, mintNFTAsset.id);
      if (!collection) throw new Error('Collection not found in AfterBlockApply hook');

      collectionWithNewActivity.add(collection.id.toString('hex'));
      accountWithNewActivity.add(senderAddress.toString('hex'));
      addInObject(totalNftMintedInCollection, collection.id, mintNFTAsset.quantity);

      channel.publish('redeemableNft:totalServeRateChanged', {
        address: collection.creator.toString('hex'),
      });
    }

    // deliverSecretAsset
    if (payload.moduleID === 1000 && payload.assetID === 2) {
      const deliverSecretAsset = codec.decode<DeliverSecretProps>(
        deliverSecretAssetSchema,
        payload.asset,
      );
      const nft = await getNFTById(input.stateStore, deliverSecretAsset.id);
      if (!nft) throw new Error('nft id not found in afterBlockApply hook');

      collectionWithNewActivity.add(nft.collectionId.toString('hex'));
      nftWithNewActivity.add(nft.id.toString('hex'));
      accountWithNewPending.add(nft.creator.toString('hex'));
      accountWithNewActivity.add(nft.creator.toString('hex'));

      channel.publish('redeemableNft:secretDelivered', {
        nft: deliverSecretAsset.id,
      });
    }

    // mintNftTypeQrAsset
    if (payload.moduleID === 1000 && payload.assetID === 3) {
      const mintNFTAsset = codec.decode<MintNFTByQRProps>(mintNftTypeQrAssetSchema, payload.asset);
      const plainPayload = Buffer.from(mintNFTAsset.body, 'base64').toString();
      const { id, quantity } = JSON.parse(plainPayload) as MintNFTByQR;

      const collection = await getCollectionById(input.stateStore, id);
      if (!collection) throw new Error('Collection not found in AfterBlockApply hook');

      collectionWithNewActivity.add(collection.id.toString('hex'));
      accountWithNewActivity.add(senderAddress.toString('hex'));
      addInObject(totalNftMintedInCollection, collection.id, quantity);

      channel.publish('redeemableNft:totalServeRateChanged', {
        address: collection.creator.toString('hex'),
      });
    }

    // likeNFtAsset
    if (payload.moduleID === 1000 && payload.assetID === 4) {
      const likeNftAsset = codec.decode<LikeNFTProps>(likeNftAssetSchema, payload.asset);
      nftWithNewLike.add(likeNftAsset.id);
    }

    // likeCollectionAsset
    if (payload.moduleID === 1000 && payload.assetID === 5) {
      const likeCollectionAsset = codec.decode<LikeCollectionProps>(
        likeCollectionAssetSchema,
        payload.asset,
      );
      collectionWithNewLike.add(likeCollectionAsset.id);
    }

    // commentNftAsset
    if (payload.moduleID === 1000 && payload.assetID === 6) {
      const commentNFTAsset = codec.decode<CommentNFTProps>(commentNftAssetSchema, payload.asset);
      nftWithNewComment.add(commentNFTAsset.id);
    }

    // commentCollectionAsset
    if (payload.moduleID === 1000 && payload.assetID === 7) {
      const commentCollectionAsset = codec.decode<CommentCollectionProps>(
        commentCollectionAssetSchema,
        payload.asset,
      );
      collectionWithNewComment.add(commentCollectionAsset.id);
    }

    // setVideoCallRejectedAsset
    if (payload.moduleID === 1000 && payload.assetID === 16) {
      const setVideoCallRejectedAsset = codec.decode<SetVideoCallRejectedProps>(
        setVideoCallRejectedAssetSchema,
        payload.asset,
      );
      const nft = await getNFTById(input.stateStore, setVideoCallRejectedAsset.id);
      if (!nft) throw new Error('nft id not found in afterBlockApply hook');
      nftWithNewActivity.add(nft.id.toString('hex'));

      channel.publish('redeemableNft:videoCallStatusChanged', {
        id: setVideoCallRejectedAsset.id,
        status: ACTIVITY.NFT.VIDEOCALLREJECTED,
      });
      channel.publish('redeemableNft:totalServeRateChanged', {
        address: nft.creator.toString('hex'),
      });
    }

    // setVideoCallAnsweredAsset
    if (payload.moduleID === 1000 && payload.assetID === 17) {
      const setVideoCallAnsweredAsset = codec.decode<SetVideoCallAnsweredProps>(
        setVideoCallAnsweredAssetSchema,
        payload.asset,
      );
      const nft = await getNFTById(input.stateStore, setVideoCallAnsweredAsset.id);
      if (!nft) throw new Error('nft id not found in afterBlockApply hook');
      nftWithNewActivity.add(nft.id.toString('hex'));

      channel.publish('redeemableNft:videoCallStatusChanged', {
        id: setVideoCallAnsweredAsset.id,
        status: ACTIVITY.NFT.VIDEOCALLANSWERED,
      });
      channel.publish('redeemableNft:totalServeRateChanged', {
        address: nft.creator.toString('hex'),
      });
    }
  }

  await asyncForEach(Object.keys(totalCollectionCreatedByAddress), async address => {
    const account = await input.stateStore.account.get<RedeemableNFTAccountProps>(
      Buffer.from(address, 'hex'),
    );
    account.redeemableNft.collection
      .slice(0, totalCollectionCreatedByAddress[address])
      .forEach(collection => collectionWithNewActivity.add(collection.toString('hex')));
  });

  await asyncForEach(Object.keys(totalNftMintedInCollection), async collectionId => {
    const collection = await getCollectionById(input.stateStore, collectionId);
    if (!collection) throw new Error('Collection not found in AfterBlockApply hook');

    collection.minted.slice(0, totalNftMintedInCollection[collectionId]).forEach(nft => {
      nftWithNewActivity.add(nft.toString('hex'));
      getNFTById(input.stateStore, nft.toString('hex'))
        .then(nftAsset => {
          if (nftAsset && nftAsset.redeem.status === 'pending-secret')
            accountWithNewMomentSlot.add(nftAsset.owner.toString('hex'));
        })
        .catch(err => {
          throw new Error(err);
        });
    });

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
      creatorAccount.redeemableNft.pending.forEach(nft =>
        pendingNFTBuffer.add(nft.toString('hex')),
      );
      accountWithNewPending.add(collection.creator.toString('hex'));
    }
  });

  if (accountWithNewPending.size > 0) {
    accountWithNewPending.forEach(address => {
      channel.publish('redeemableNft:newPendingByAddress', {
        address,
      });
      channel.publish('redeemableNft:totalServeRateChanged', {
        address,
      });
    });
  }

  if (accountWithNewMomentSlot.size > 0) {
    accountWithNewMomentSlot.forEach(address => {
      channel.publish('redeemableNft:totalMomentSlotChanged', {
        address,
      });
    });
  }

  if (accountWithNewCollection.size > 0) {
    channel.publish('redeemableNft:newCollection');
    accountWithNewCollection.forEach(address =>
      channel.publish('redeemableNft:newCollectionByAddress', {
        address,
        count: totalCollectionCreatedByAddress[address],
      }),
    );
  }

  if (collectionWithNewActivity.size > 0) {
    collectionWithNewActivity.forEach(collection =>
      channel.publish('redeemableNft:newActivityCollection', {
        collection,
        timestamp: timestampBlock.timestamp,
      }),
    );
  }

  if (nftWithNewActivity.size > 0) {
    nftWithNewActivity.forEach(nft =>
      channel.publish('redeemableNft:newActivityNFT', {
        nft,
        timestamp: timestampBlock.timestamp,
      }),
    );
  }

  if (accountWithNewActivity.size > 0) {
    accountWithNewActivity.forEach(address =>
      channel.publish('redeemableNft:newActivityProfile', {
        address,
        timestamp: timestampBlock.timestamp,
      }),
    );
  }

  if (pendingNFTBuffer.size > 0) {
    channel.publish('redeemableNft:pendingUtilityDelivery', {
      nfts: [...pendingNFTBuffer],
    });
  }

  if (nftWithNewLike.size > 0) {
    nftWithNewLike.forEach(nft => channel.publish('redeemableNft:newNFTLike', { id: nft }));
  }

  if (collectionWithNewLike.size > 0) {
    collectionWithNewLike.forEach(collection =>
      channel.publish('redeemableNft:newCollectionLike', { id: collection }),
    );
  }

  if (nftWithNewComment.size > 0) {
    nftWithNewComment.forEach(nft => channel.publish('redeemableNft:newNFTComment', { id: nft }));
  }

  if (collectionWithNewComment.size > 0) {
    collectionWithNewComment.forEach(collection =>
      channel.publish('redeemableNft:newCollectionComment', { id: collection }),
    );
  }
}
