import { NFTUtility } from '../../../../types/core/chain/nft/NFTUtility';

export const UTILITY: Record<string, NFTUtility> = {
  VIDEOCALL: 'videocall',
  CHAT: 'chat',
  GIFT: 'gift',
  CONTENT: 'content',
  QR: 'qr',
  STREAM: 'stream',
};

export const UTILITY_WITH_SECRET: NFTUtility[] = ['content'];
