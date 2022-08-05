import { Account } from '@liskhq/lisk-chain';
import { DPOSAccountProps } from 'lisk-framework/dist-node/modules/dpos';
import { TokenAccount } from 'lisk-framework/dist-node/modules/token/types';
import { PersonaAccountProps } from '../../../../types/core/account/persona';
import { RedeemableNFTAccountProps } from '../../../../types/core/account/profile';

export function getDefaultAccount(
  address: string,
): PersonaAccountProps & Account & DPOSAccountProps & RedeemableNFTAccountProps & TokenAccount {
  return {
    address: Buffer.from(address, 'hex'),
    token: {
      balance: BigInt(0),
    },
    sequence: {
      nonce: '0',
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
      owned: [],
      onSale: [],
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
