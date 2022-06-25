import {
  AddStakeProps,
  AddStakeUI,
} from '../../../../../../types/core/asset/chain/add_stake_asset';
import {
  RegisterUsernameProps,
  RegisterUsernameUI,
} from '../../../../../../types/core/asset/chain/register_username';
import {
  CreateOneKindNFTProps,
  CreateOneKindNFTUI,
} from '../../../../../../types/core/asset/redeemable_nft/create_onekind_nft_asset';
import {
  DeliverSecretProps,
  DeliverSecretUI,
} from '../../../../../../types/core/asset/redeemable_nft/deliver_secret_asset';
import {
  MintNFTProps,
  MintNFTUI,
} from '../../../../../../types/core/asset/redeemable_nft/mint_nft_asset';
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

function deliverSecret(
  payload: AppTransaction<DeliverSecretUI>,
): AppTransaction<DeliverSecretProps> {
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
        default:
          return payload;
      }
    default:
      return payload;
  }
}
