import { TransactionApplyContext } from 'lisk-framework';
import { AddLikeProps } from 'enevti-types/asset/like/add_like_asset';
import { codec } from 'lisk-sdk';
import { ModuleInfo } from 'enevti-types/utils/moduleInfo';
import { ADD_LIKE_ASSET_NAME, LIKE_PREFIX } from '../../../like/constants/codec';
import { isCollectionEligibleForRaffle } from '../../utils/eligibility';
import { addSocialRaffleRegistrar } from '../../utils/add';

export default async function socialRaffleAfterTransactionApply(input: TransactionApplyContext) {
  const { senderPublicKey, moduleID, assetID } = input.transaction;
  const likeModuleInfo = await input.reducerHandler.invoke<ModuleInfo<typeof ADD_LIKE_ASSET_NAME>>(
    `${LIKE_PREFIX}:getInfo`,
  );
  if (moduleID === likeModuleInfo.id && assetID === likeModuleInfo.asset.addLike.id) {
    const { identifier, id } = codec.decode<AddLikeProps>(
      likeModuleInfo.asset.addLike.schema,
      input.transaction.asset,
    );
    if (
      identifier === 'collection' &&
      (await isCollectionEligibleForRaffle(input.reducerHandler, Buffer.from(id, 'hex')))
    ) {
      await addSocialRaffleRegistrar(input.stateStore, Buffer.from(id, 'hex'), senderPublicKey);
    }
  }
}
