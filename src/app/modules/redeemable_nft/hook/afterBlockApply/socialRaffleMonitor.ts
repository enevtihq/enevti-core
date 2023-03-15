import { AfterBlockApplyContext } from 'lisk-framework';
import { RedeemableNFTAccountProps } from 'enevti-types/account/profile';
import { GetRecordParam } from 'enevti-types/param/social_raffle';
import { SocialRaffleBlockRecord } from 'enevti-types/chain/social_raffle';
import { getCollectionById } from '../../utils/collection';
import { addInObject, asyncForEach } from '../../utils/transaction';

export const socialRaffleMonitor = async (
  input: AfterBlockApplyContext,
  collectionWithNewActivity: Set<string>,
  accountWithNewActivity: Set<string>,
  totalNftMintedInCollection: { [collection: string]: number },
  pendingNFTBuffer: Set<string>,
  accountWithNewPending: Set<string>,
) => {
  const socialRaffleRecordPrevBlock = await input.reducerHandler.invoke<SocialRaffleBlockRecord>(
    'socialRaffle:getRecord',
    { height: input.block.header.height - 1 } as GetRecordParam,
  );
  if (socialRaffleRecordPrevBlock.items.length > 0) {
    await asyncForEach(socialRaffleRecordPrevBlock.items, async items => {
      const collection = await getCollectionById(input.stateStore, items.id.toString('hex'));
      if (!collection) throw new Error('Collection not found while monintorng social raffle');

      collectionWithNewActivity.add(items.id.toString('hex'));
      accountWithNewActivity.add(items.winner.toString('hex'));
      addInObject(totalNftMintedInCollection, items.id, items.raffled.length);

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
  }
};
