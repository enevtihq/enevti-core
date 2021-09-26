const { BaseModule, codec } = require("lisk-sdk");
const { REDEEMABLE_NFT_MODULE_ID } = require("./constants/id");
const { RedeemableNFTAccountSchema } = require("./schemas/account");

class RedeemableNFTModule extends BaseModule {
  name = "redeemableNFT";
  id = REDEEMABLE_NFT_MODULE_ID;
  accountSchema = RedeemableNFTAccountSchema;

  transactionAssets = [];

  // async afterGenesisBlockApply({ genesisBlock, stateStore, reducerHandler }) {}
}

module.exports = { CollabolancerModule };
