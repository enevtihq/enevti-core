import { NFTRedeem } from '../../../../types/core/chain/nft/NFTRedeem';

export const RECURRING: Record<
  Uppercase<NFTRedeem['schedule']['recurring']>,
  NFTRedeem['schedule']['recurring']
> = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  ONCE: 'once',
  INSTANT: 'instant',
};
