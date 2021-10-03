const { BaseModule, codec } = require("lisk-sdk");
const CreateOneKindNFTAsset = require("./assets/create_onekind_nft");
const MintNFTAsset = require("./assets/mint_nft");
const RequestRedeemAsset = require("./assets/request_redeem");
const { REDEEMABLE_NFT_MODULE_ID, REDEEMABLE_NFT_REQUEST_REDEEM, REDEEMABLE_NFT_DELIVER_REDEEM, REDEEMBALE_NFT_REJECT_REDEEM } = require("./constants/id");
const { RedeemableNFTAccountSchema } = require("./schemas/account");
const DeliverRedeemAssetSchema = require("./schemas/assets/deliever_redeem");
const RejectRedeemAssetSchema = require("./schemas/assets/reject_redeem");
const RequestRedeemAssetSchema = require("./schemas/assets/request_redeem");
const { getNFTById } = require("./utils/chain_state");

class RedeemableNFTModule extends BaseModule {
  name = "redeemableNFT";
  id = REDEEMABLE_NFT_MODULE_ID;
  accountSchema = RedeemableNFTAccountSchema;

  transactionAssets = [new CreateOneKindNFTAsset(), new MintNFTAsset(), new RequestRedeemAsset()];
  events = ["requested", "rejected", "delivered"];

  async afterTransactionApply({ transaction, stateStore, reducerHandler }) {
    if (transaction.moduleID === this.id && transaction.assetID === REDEEMABLE_NFT_REQUEST_REDEEM) {
      const requestAsset = codec.decode(RequestRedeemAssetSchema, transaction.asset);
      const nft = await getNFTById(stateStore, requestAsset.nftId);
      this._channel.publish("redeemableNFT:requested", {
        from: transaction._senderAddress.toString("hex"),
        nft: nft.id.toString("hex"),
        to: nft.originAddress.toString("hex"),
      });
    }
    if (transaction.moduleID === this.id && transaction.assetID === REDEEMABLE_NFT_DELIVER_REDEEM) {
      const deliverAsset = codec.decode(DeliverRedeemAssetSchema, transaction.asset);
      const nft = await getNFTById(stateStore, deliverAsset.nftId);
      this._channel.publish("redeemableNFT:delivered", {
        from: transaction._senderAddress.toString("hex"),
        nft: nft.id.toString("hex"),
        to: nft.originAddress.toString("hex"),
        cipher: deliverAsset.cipher,
        nonce: deliverAsset.nonce,
      });
    }
    if (transaction.moduleID === this.id && transaction.assetID === REDEEMBALE_NFT_REJECT_REDEEM) {
      const rejectAsset = codec.decode(RejectRedeemAssetSchema, transaction.asset);
      const nft = await getNFTById(stateStore, rejectAsset.nftId);
      this._channel.publish("redeemableNFT:rejected", {
        from: transaction._senderAddress.toString("hex"),
        nft: nft.id.toString("hex"),
        to: nft.originAddress.toString("hex"),
      });
    }
  }
}

module.exports = { RedeemableNFTModule };
