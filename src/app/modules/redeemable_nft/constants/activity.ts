import {
  EngagementActivityName,
  ProfileActivityName,
} from '../../../../types/core/account/profile';
import { CollectionActivityName } from '../../../../types/core/chain/collection';
import { MomentActivityName } from '../../../../types/core/chain/moment';
import { NFTActivityName } from '../../../../types/core/chain/nft/NFTActivity';

export const ACTIVITY: {
  NFT: Record<Uppercase<NFTActivityName>, NFTActivityName>;
  COLLECTION: Record<Uppercase<CollectionActivityName>, CollectionActivityName>;
  PROFILE: Record<Uppercase<ProfileActivityName>, ProfileActivityName>;
  ENGAGEMENT: Record<Uppercase<EngagementActivityName>, EngagementActivityName>;
  MOMENT: Record<Uppercase<MomentActivityName>, MomentActivityName>;
} = {
  NFT: {
    MINT: 'mint',
    RAFFLED: 'raffled',
    REDEEM: 'redeem',
    SECRETDELIVERED: 'secretDelivered',
    VIDEOCALLANSWERED: 'videoCallAnswered',
    VIDEOCALLREJECTED: 'videoCallRejected',
    MOMENTCREATED: 'momentCreated',
  },
  COLLECTION: {
    RAFFLED: 'raffled',
    CREATED: 'created',
    MINTED: 'minted',
    SECRETDELIVERED: 'secretDelivered',
    VIDEOCALLANSWERED: 'videoCallAnswered',
    VIDEOCALLREJECTED: 'videoCallRejected',
    MOMENTCREATED: 'momentCreated',
  },
  PROFILE: {
    WINRAFFLE: 'winRaffle',
    TOKENSENT: 'tokenSent',
    TOKENRECEIVED: 'tokenReceived',
    REGISTERUSERNAME: 'registerUsername',
    ADDSTAKE: 'addStake',
    SELFSTAKE: 'selfStake',
    CREATENFT: 'createNFT',
    MINTNFT: 'mintNFT',
    NFTSALE: 'NFTSale',
    DELIVERSECRET: 'deliverSecret',
    MOMENTCREATED: 'momentCreated',
  },
  ENGAGEMENT: {
    LIKENFT: 'likeNft',
    LIKECOLLECTION: 'likeCollection',
    LIKECOMMENT: 'likeComment',
    LIKEREPLY: 'likeReply',
    LIKECOMMENTCLUBS: 'likeCommentClubs',
    LIKEREPLYCLUBS: 'likeReplyClubs',
    COMMENTNFT: 'commentNft',
    COMMENTCOLLECTION: 'commentCollection',
    REPLYCOMMENT: 'replyComment',
    REPLYCOMMENTCLUBS: 'replyCommentClubs',
    COMMENTCOLLECTIONCLUBS: 'commentCollectionClubs',
    COMMENTNFTCLUBS: 'commentNftClubs',
    SETVIDEOCALLANSWERED: 'setVideoCallAnswered',
    SETVIDEOCALLREJECTED: 'setVideoCallRejected',
  },
  MOMENT: {
    MINTED: 'minted',
  },
};
