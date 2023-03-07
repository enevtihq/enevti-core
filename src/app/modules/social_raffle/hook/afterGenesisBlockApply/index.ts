import { SocialRaffleConfig } from 'enevti-types/chain/social_raffle/config';

export default function socialRaffleAfterGenesisBlockApply(config: SocialRaffleConfig) {
  if (config.socialRaffle.blockInterval < 2) {
    throw new Error('config.socialRaffle.blockInterval must be 2 or higher');
  }
}
