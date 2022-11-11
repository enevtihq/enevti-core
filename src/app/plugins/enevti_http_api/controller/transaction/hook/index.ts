import { BaseChannel } from 'lisk-framework';
import { CreateOneKindNFTUI } from '../../../../../../types/core/asset/redeemable_nft/create_onekind_nft_asset';
import { AppTransaction } from '../../../../../../types/core/service/transaction';
import { invokeStoreResizedImage } from '../../../../ipfs_image_resized/utils/invoker';

export async function createOneKindNFTAfterTransaction(
  channel: BaseChannel,
  payload: AppTransaction<CreateOneKindNFTUI>,
) {
  await invokeStoreResizedImage(channel, payload.asset.data);
}

export async function afterTransactionPosted(
  channel: BaseChannel,
  payload: Record<string, unknown>,
) {
  switch (payload.moduleID) {
    case 1000:
      switch (payload.assetID) {
        case 0:
          await createOneKindNFTAfterTransaction(
            channel,
            (payload as unknown) as AppTransaction<CreateOneKindNFTUI>,
          );
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
}
