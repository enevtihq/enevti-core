import {
  AddStakeProps,
  AddStakeUI,
} from '../../../../../../types/core/asset/chain/add_stake_asset';
import {
  RegisterUsernameProps,
  RegisterUsernameUI,
} from '../../../../../../types/core/asset/chain/register_username';
import {
  CommentCollectionProps,
  CommentCollectionUI,
} from '../../../../../../types/core/asset/redeemable_nft/comment_collection_asset';
import {
  CommentNFTProps,
  CommentNFTUI,
} from '../../../../../../types/core/asset/redeemable_nft/comment_nft_asset';
import {
  CreateOneKindNFTProps,
  CreateOneKindNFTUI,
} from '../../../../../../types/core/asset/redeemable_nft/create_onekind_nft_asset';
import {
  DeliverSecretProps,
  DeliverSecretUI,
} from '../../../../../../types/core/asset/redeemable_nft/deliver_secret_asset';
import {
  LikeCollectionProps,
  LikeCollectionUI,
} from '../../../../../../types/core/asset/redeemable_nft/like_collection_asset';
import {
  LikeNFTProps,
  LikeNFTUI,
} from '../../../../../../types/core/asset/redeemable_nft/like_nft_asset';
import {
  MintNFTProps,
  MintNFTUI,
} from '../../../../../../types/core/asset/redeemable_nft/mint_nft_asset';
import {
  MintNFTByQRProps,
  MintNFTByQRUI,
} from '../../../../../../types/core/asset/redeemable_nft/mint_nft_type_qr_asset';
import {
  TransferTokenProps,
  TransferTokenUI,
} from '../../../../../../types/core/asset/token/transfer_asset';
import { AppTransaction } from '../../../../../../types/core/service/transaction';

function registerDelegate(
  payload: AppTransaction<RegisterUsernameUI>,
): AppTransaction<RegisterUsernameProps> {
  return payload;
}

function voteDelegate(payload: AppTransaction<AddStakeUI>): AppTransaction<AddStakeProps> {
  return {
    ...payload,
    asset: {
      votes: ((payload.asset as { votes: unknown }).votes as {
        delegateAddress: string;
        amount: string;
      }[]).map(item => ({
        delegateAddress: Buffer.from(item.delegateAddress, 'hex'),
        amount: BigInt(item.amount),
      })),
    },
  };
}

function createOneKindNFT(
  payload: AppTransaction<CreateOneKindNFTUI>,
): AppTransaction<CreateOneKindNFTProps> {
  return {
    ...payload,
    asset: {
      ...payload.asset,
      price: {
        amount: BigInt(payload.asset.price.amount),
        currency: payload.asset.price.currency,
      },
    },
  };
}

function mintNFT(payload: AppTransaction<MintNFTUI>): AppTransaction<MintNFTProps> {
  return payload;
}

function mintNFTQR(payload: AppTransaction<MintNFTByQRUI>): AppTransaction<MintNFTByQRProps> {
  return payload;
}

function deliverSecret(
  payload: AppTransaction<DeliverSecretUI>,
): AppTransaction<DeliverSecretProps> {
  return payload;
}

function likeNFT(payload: AppTransaction<LikeNFTUI>): AppTransaction<LikeNFTProps> {
  return payload;
}

function likeCollection(
  payload: AppTransaction<LikeCollectionUI>,
): AppTransaction<LikeCollectionProps> {
  return payload;
}

function commentNFT(payload: AppTransaction<CommentNFTUI>): AppTransaction<CommentNFTProps> {
  return payload;
}

function commentCollection(
  payload: AppTransaction<CommentCollectionUI>,
): AppTransaction<CommentCollectionProps> {
  return payload;
}

function transferToken(
  payload: AppTransaction<TransferTokenUI>,
): AppTransaction<TransferTokenProps> {
  return {
    ...payload,
    asset: {
      ...payload.asset,
      amount: BigInt(payload.asset.amount),
      recipientAddress: Buffer.from(payload.asset.recipientAddress, 'hex'),
    },
  };
}

export default function transformAsset(payload: Record<string, unknown>) {
  switch (payload.moduleID) {
    case 2:
      switch (payload.assetID) {
        case 0:
          return transferToken((payload as unknown) as AppTransaction<TransferTokenUI>);
        default:
          return payload;
      }
    case 5:
      switch (payload.assetID) {
        case 0:
          return registerDelegate((payload as unknown) as AppTransaction<RegisterUsernameUI>);
        case 1:
          return voteDelegate((payload as unknown) as AppTransaction<AddStakeUI>);
        default:
          return payload;
      }
    case 1000:
      switch (payload.assetID) {
        case 0:
          return createOneKindNFT((payload as unknown) as AppTransaction<CreateOneKindNFTUI>);
        case 1:
          return mintNFT((payload as unknown) as AppTransaction<MintNFTUI>);
        case 2:
          return deliverSecret((payload as unknown) as AppTransaction<DeliverSecretUI>);
        case 3:
          return mintNFTQR((payload as unknown) as AppTransaction<MintNFTByQRUI>);
        case 4:
          return likeNFT((payload as unknown) as AppTransaction<LikeNFTUI>);
        case 5:
          return likeCollection((payload as unknown) as AppTransaction<LikeCollectionUI>);
        case 6:
          return commentNFT((payload as unknown) as AppTransaction<CommentNFTUI>);
        case 7:
          return commentCollection((payload as unknown) as AppTransaction<CommentCollectionUI>);
        default:
          return payload;
      }
    default:
      return payload;
  }
}
