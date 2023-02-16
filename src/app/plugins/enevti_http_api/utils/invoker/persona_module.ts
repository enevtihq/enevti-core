import { Account } from '@liskhq/lisk-chain';
import { BaseChannel } from 'lisk-framework';
import { DPOSAccountProps } from 'lisk-framework/dist-node/modules/dpos';
import { TokenAccount } from 'lisk-framework/dist-node/modules/token/types';
import { PersonaAccountProps } from 'enevti-types/account/persona';
import { CreaFiAccountProps, RedeemableNFTAccountProps } from 'enevti-types/account/profile';

export const invokeGetAccount = async (
  channel: BaseChannel,
  address: string,
): Promise<
  CreaFiAccountProps &
    PersonaAccountProps &
    Account &
    DPOSAccountProps &
    RedeemableNFTAccountProps &
    TokenAccount & { sequence: { nonce: bigint } }
> => channel.invoke('persona:getAccount', { address });
