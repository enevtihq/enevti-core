/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { ActivityModule } from "./modules/activity/activity_module";
import { CommentModule } from "./modules/comment/comment_module";
import { CountModule } from "./modules/count/count_module";
import { CreatorFinanceModule } from './modules/creator_finance/creator_finance_module';
import { DynamicBaseFeeModule } from "./modules/dynamic_base_fee/dynamic_base_fee_module";
import { LikeModule } from "./modules/like/like_module";
import { NftExclusiveCommentModule } from "./modules/nft_exclusive_comment/nft_exclusive_comment_module";
import { PersonaModule } from './modules/persona/persona_module';
import { RedeemableNftModule } from './modules/redeemable_nft/redeemable_nft_module';
import { RegistrarModule } from "./modules/registrar/registrar_module";

export const registerModules = (app: Application): void => {
    app.registerModule(RedeemableNftModule);
    app.registerModule(PersonaModule);
    app.registerModule(CreatorFinanceModule);
    app.registerModule(DynamicBaseFeeModule);
    app.registerModule(RegistrarModule);
    app.registerModule(ActivityModule);
    app.registerModule(LikeModule);
    app.registerModule(CountModule);
    app.registerModule(CommentModule);
    app.registerModule(NftExclusiveCommentModule);
};
