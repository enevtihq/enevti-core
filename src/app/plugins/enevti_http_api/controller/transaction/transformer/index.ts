import {
  CreateOneKindNFTProps,
  CreateOneKindNFTUI,
} from '../../../../../../types/core/asset/redeemable_nft/create_onekind_nft_asset';
import { AppTransaction } from '../../../../../../types/core/service/transaction';

function registerDelegate(payload: Record<string, unknown>) {
  return payload;
}

function voteDelegate(payload: Record<string, unknown>) {
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
      time: {
        date: payload.asset.time.date.toString(),
        day: payload.asset.time.day.toString(),
        month: payload.asset.time.month.toString(),
        year: payload.asset.time.year.toString(),
      },
      from: {
        hour: payload.asset.from.hour.toString(),
        minute: payload.asset.from.minute.toString(),
      },
      price: {
        amount: BigInt(payload.asset.price.amount),
        currency: payload.asset.price.currency,
      },
      mintingExpire: payload.asset.mintingExpire.toString(),
    },
  };
}

export default function transformAsset(payload: Record<string, unknown>) {
  switch (payload.moduleID) {
    case 5:
      switch (payload.assetID) {
        case 0:
          return registerDelegate(payload);
        case 1:
          return voteDelegate(payload);
        default:
          return payload;
      }
    case 1000:
      switch (payload.assetID) {
        case 0:
          return createOneKindNFT((payload as unknown) as AppTransaction<CreateOneKindNFTUI>);
        default:
          return payload;
      }
    default:
      return payload;
  }
}
