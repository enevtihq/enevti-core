import { BaseChannel } from 'lisk-framework';
import { StakerChain } from 'enevti-types/chain/stake';

export const invokeGetStakerByAddress = async (
  channel: BaseChannel,
  address: string,
): Promise<StakerChain | undefined> =>
  channel.invoke('creatorFinance:getStakerByAddress', { address });
