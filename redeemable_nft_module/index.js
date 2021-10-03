const { BaseModule, codec } = require("lisk-sdk");
const CreateOneKindNFTAsset = require("./assets/create_onekind_nft");
const DeliverRedeemAsset = require("./assets/deliver_redeem");
const MintNFTAsset = require("./assets/mint_nft");
const RejectRedeemAsset = require("./assets/reject_redeem");
const RequestRedeemAsset = require("./assets/request_redeem");
const { REDEEMABLE_NFT_MODULE_ID, REDEEMABLE_NFT_REQUEST_REDEEM, REDEEMABLE_NFT_DELIVER_REDEEM, REDEEMBALE_NFT_REJECT_REDEEM } = require("./constants/id");
const JOURNEYACTIVITY = require("./constants/journey_activity");
const REDEEMSTATUS = require("./constants/redeem_status");
const { RedeemableNFTAccountSchema } = require("./schemas/account");
const DeliverRedeemAssetSchema = require("./schemas/assets/deliever_redeem");
const RejectRedeemAssetSchema = require("./schemas/assets/reject_redeem");
const RequestRedeemAssetSchema = require("./schemas/assets/request_redeem");
const { getNFTById, getRedeemMonitor, setNFTById, setRedeemMonitor } = require("./utils/chain_state");
const { asyncForEach } = require("./utils/helper");

class RedeemableNFTModule extends BaseModule {
  name = "redeemableNFT";
  id = REDEEMABLE_NFT_MODULE_ID;
  accountSchema = RedeemableNFTAccountSchema;

  transactionAssets = [new CreateOneKindNFTAsset(), new MintNFTAsset(), new RequestRedeemAsset(), new DeliverRedeemAsset(), new RejectRedeemAsset()];
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

  async afterBlockApply({ block, stateStore, reducerHandler, consensus }) {
    const redeemMonitor = await getRedeemMonitor(stateStore);
    if (redeemMonitor.checkpoint !== 0 && redeemMonitor.checkpoint < block.header.timestamp) {
      const index = [];
      for (let i = 0; i < redeemMonitor.all.length; i++) {
        if (redeemMonitor.all[i].time >= block.header.timestamp) break;
        else index.push(i);
      }
      asyncForEach(index, (i) => {
        const nft = await getNFTById(stateStore, redeemMonitor.all[i].nft);
        nft.redeem.status = REDEEMSTATUS.IDLE;
        switch (redeemMonitor.all[i].status) {
          case REDEEMSTATUS.REQUESTED:
            const originAccount = await stateStore.account.get(nft.originAddress);
            const senderRequestIndex = originAccount.redeemableNFT.creator.requestQueue.findIndex((a) => a.equals(nft.id));
            originAccount.redeemableNFT.creator.timeout++;
            originAccount.redeemableNFT.creator.requestQueue.splice(senderRequestIndex, 1);
            await stateStore.account.set(nft.originAddress, originAccount);
            nft.journey.unshift({
              activity: JOURNEYACTIVITY.TIMEOUT,
              date: block.header.timestamp,
              by: "",
              from: nft.originAddress,
              message: `Requested by ${nft.ownerAddress.toString("hex")} on: ${new Date(nft.redeem.touched).toUTCString()}`,
              amount: 0,
            });
            break;
          case REDEEMSTATUS.READY:
            nft.redeem.message.cipher = "";
            nft.redeem.message.nonce = "";
            break;
          default:
            throw new Error("FATAL: [afterBlockApply at redeemableNFT module] unkown status");
        }
        nft.redeem.touched = block.header.timestamp;
        await setNFTById(stateStore, nft.id, nft);
      });
      for (let i = index.length - 1; i >= 0; i--) redeemMonitor.all.splice(i, 1);
      if (redeemMonitor.all.length > 0) {
        redeemMonitor.all.sort((a, b) => a - b);
        if (redeemMonitor.checkpoint > redeemMonitor.all[0].time) {
          redeemMonitor.checkpoint = redeemMonitor.all[0].time;
        }
      } else {
        redeemMonitor.checkpoint = 0;
      }
      await setRedeemMonitor(stateStore, redeemMonitor);
    }
  }
}

module.exports = { RedeemableNFTModule };
