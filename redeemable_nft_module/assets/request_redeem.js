const { BaseAsset } = require("lisk-sdk");
const { REDEEMABLE_NFT_REQUEST_REDEEM } = require("../constants/id");
const RequestRedeemAssetSchema = require("../schemas/assets/request_redeem");
const REDEEMSTATUS = require("../constants/redeem_status");
const RECURRING = require("../constants/recurring");
const { getNFTById, setNFTById, getRedeemMonitor, setRedeemMonitor } = require("../utils/chain_state");
const FEE = require("../constants/fee");

class RequestRedeemAsset extends BaseAsset {
  name = "requestRedeemAsset";
  id = REDEEMABLE_NFT_REQUEST_REDEEM;
  schema = RequestRedeemAssetSchema;

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const senderAddress = transaction.senderAddress;
    const timestampInSec = await stateStore.chain.lastBlockHeaders[0].timestamp;
    const blockDate = new Date(timestampInSec * 1000);
    const nft = await getNFTById(stateStore, asset.nftId);

    if (!nft) {
      throw new Error("NFT doesn't exist");
    }

    if (!nft.ownerAddress.equals(senderAddress)) {
      throw new Error("Sender is not the owner");
    }

    if (nft.redeem.status !== REDEEMSTATUS.IDLE) {
      throw new Error("NFT status is not idle");
    }

    if (nft.redeem.count >= nft.redeem.limit) {
      throw new Error("NFT redeem count exceet limit");
    }

    if (new Date(blockDate).getUTCHours() !== nft.redeem.from.hour) {
      throw new Error("Its not the hour to redeem!");
    }

    if (new Date(blockDate).getUTCMinutes() !== nft.redeem.from.minute) {
      throw new Error("Its not the minute to redeem!");
    }

    let baseTime;
    switch (nft.redeem.recurring) {
      case RECURRING.PERWEEK:
        if (blockDate.getUTCDay() !== nft.redeem.time.day) {
          throw new Error("Its not the day to redeem!");
        }
        baseTime = Date.UTC(blockDate.getUTCFullYear, blockDate.getUTCMonth, blockDate.getUTCDate, nft.redeem.from.hour, nft.redeem.from.minute);
        break;
      case RECURRING.PERMONTH:
        if (blockDate.getUTCDate() !== nft.redeem.time.date) {
          throw new Error("Its not the date to redeem!");
        }
        baseTime = Date.UTC(blockDate.getUTCFullYear, blockDate.getUTCMonth, nft.redeem.time.date, nft.redeem.from.hour, nft.redeem.from.minute);
        break;
      case RECURRING.PERYEAR:
        if (blockDate.getUTCDate() !== nft.redeem.time.date) {
          throw new Error("Its not the date to redeem!");
        }
        if (blockDate.getUTCMonth() !== nft.redeem.time.month) {
          throw new Error("Its not the month to redeem!");
        }
        baseTime = Date.UTC(blockDate.getUTCFullYear, nft.redeem.time.month, nft.redeem.time.date, nft.redeem.from.hour, nft.redeem.from.minute);
        break;
      case RECURRING.ONCE:
        if (blockDate.getUTCDate() !== nft.redeem.time.date) {
          throw new Error("Its not the date to redeem!");
        }
        if (blockDate.getUTCMonth() !== nft.redeem.time.month) {
          throw new Error("Its not the month to redeem!");
        }
        if (blockDate.getUTCFullYear !== nft.redeem.time.year) {
          throw new Error("It's not the year to redeem!");
        }
        baseTime = Date.UTC(nft.redeem.time.year, nft.redeem.time.month, nft.redeem.time.date, nft.redeem.from.hour, nft.redeem.from.minute);
        break;
      default:
        throw new Error("FATAL: Reccuring type unknown");
    }

    const redeemMonitor = await getRedeemMonitor(stateStore);
    const checkpointTime = baseTime + nft.redeem.until;
    if (redeemMonitor.checkpoint.time > checkpointTime) {
      redeemMonitor.checkpoint.time = checkpointTime;
      redeemMonitor.checkpoint.nft = [nft.id];
    }
    if (redeemMonitor.checkpoint.time === checkpointTime) {
      redeemMonitor.checkpoint.nft.push(nft.id);
    }
    redeemMonitor.all.push(nft);

    const originAddress = nft.originAddress;
    const originAccount = await stateStore.account.get(originAddress);
    nft.redeem.status = REDEEMSTATUS.REQUESTED;
    nft.redeem.touched = checkpointTime;
    originAccount.redeemableNFT.creator.requestQueue.push(nft.id);

    await reducerHandler.invoke("token:debit", {
      address: senderAddress,
      amount: FEE.REDEEM,
    });

    await reducerHandler.invoke("token:credit", {
      address: originAddress,
      amount: FEE.REDEEM,
    });

    await setNFTById(stateStore, nft.id, nft);
    await stateStore.account.set(originAddress, originAccount);
    await setRedeemMonitor(stateStore, redeemMonitor);
  }
}

module.exports = RequestRedeemAsset;
