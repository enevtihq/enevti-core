/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { CreatorFinanceModule } from './modules/creator_finance/creator_finance_module';
import { PersonaModule } from './modules/persona/persona_module';
import { RedeemableNftModule } from './modules/redeemable_nft/redeemable_nft_module';

export const registerModules = (app: Application): void => {
  app.registerModule(RedeemableNftModule);
  app.registerModule(PersonaModule);
  app.registerModule(CreatorFinanceModule);
};
