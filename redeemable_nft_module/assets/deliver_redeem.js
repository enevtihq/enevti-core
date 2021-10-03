const { BaseAsset } = require("lisk-sdk");
const { REDEEMABLE_NFT_REQUEST_REDEEM } = require("../constants/id");
const RequestRedeemAssetSchema = require("../schemas/assets/request_redeem");
const REDEEMSTATUS = require("../constants/redeem_status");
const { getNFTById, setNFTById, getRedeemMonitor, setRedeemMonitor } = require("../utils/chain_state");
const JOURNEYACTIVITY = require("../constants/journey_activity");

class RequestRedeemAsset extends BaseAsset {
  name = "requestRedeemAsset";
  id = REDEEMABLE_NFT_REQUEST_REDEEM;
  schema = RequestRedeemAssetSchema;

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);
    const timestampInSec = await stateStore.chain.lastBlockHeaders[0].timestamp;
    const nft = await getNFTById(stateStore, asset.nftId);

    if (!nft) {
      throw new Error("NFT doesn't exist");
    }

    if (!nft.originAddress.equals(senderAddress)) {
      throw new Error("Sender is not the origin of this NFT");
    }

    if (!Object.values(senderAccount.redeemableNFT.creator.requestQueue).includes(nft.id)) {
      throw new Error("NFT is not in origin requesQueue");
    }

    if (nft.redeem.status !== REDEEMSTATUS.REQUESTED) {
      throw new Error("NFT status is not requested");
    }

    nft.redeem.status = REDEEMSTATUS.READY;
    nft.redeem.count++;
    nft.redeem.message.cipher = asset.cipher;
    nft.redeem.message.nonce = asset.nonce;

    nft.journey.unshift({
      activity: JOURNEYACTIVITY.DELIVERED,
      date: timestampInSec,
      by: nft.ownerAddress,
      from: senderAddress,
      message: `Requested by ${nft.ownerAddress.toString("hex")} on: ${new Date(nft.redeem.touched).toUTCString()}`,
      amount: 0,
    });

    nft.redeem.touched = timestampInSec;
    senderAccount.redeemableNFT.creator.delivered++;
    const senderRequestIndex = senderAccount.redeemableNFT.creator.requestQueue.findIndex((a) => a.equals(nft.id));
    senderAccount.redeemableNFT.creator.requestQueue.splice(senderRequestIndex, 1);

    const redeemMonitor = await getRedeemMonitor(stateStore);
    const redeemMonitorItemIndex = redeemMonitor.all.findIndex((a) => {
      a.id.equals(nft.id);
    });
    redeemMonitor.all[redeemMonitorItemIndex] = nft;

    await setNFTById(stateStore, nft.id, nft);
    await stateStore.account.set(senderAddress, senderAccount);
    await setRedeemMonitor(stateStore, redeemMonitor);
  }
}

module.exports = RequestRedeemAsset;
