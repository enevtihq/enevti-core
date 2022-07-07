import { NFTUtility } from '../../../../types/core/chain/nft/NFTUtility';

export const UTILITY: Record<string, NFTUtility> = {
  VIDEOCALL: 'videocall',
  GIFT: 'gift',
  CONTENT: 'content',
  QR: 'qr',
};

export const UTILITY_WITH_SECRET: NFTUtility[] = ['content'];
