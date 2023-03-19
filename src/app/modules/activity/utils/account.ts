import { AccountChain } from 'enevti-types/account/profile';

export function getDefaultAccount(address: string): AccountChain {
  return {
    address: Buffer.from(address, 'hex'),
    token: {
      balance: BigInt(0),
    },
    creatorFinance: {
      totalStake: BigInt(0),
    },
    sequence: {
      nonce: BigInt(0),
    },
    keys: {
      mandatoryKeys: [],
      optionalKeys: [],
      numberOfSignatures: 0,
    },
    dpos: {
      delegate: {
        username: '',
        pomHeights: [],
        consecutiveMissedBlocks: 0,
        lastForgedHeight: 0,
        isBanned: false,
        totalVotesReceived: BigInt(0),
      },
      sentVotes: [],
      unlocking: [],
    },
    redeemableNft: {
      nftSold: 0,
      treasuryAct: 0,
      serveRate: 0,
      raffled: 0,
      momentSlot: 0,
      likeSent: 0,
      commentSent: 0,
      commentClubsSent: 0,
      owned: [],
      onSale: [],
      momentCreated: [],
      collection: [],
      pending: [],
    },
    persona: {
      photo: '',
      username: '',
      social: {
        twitter: '',
      },
    },
  };
}
