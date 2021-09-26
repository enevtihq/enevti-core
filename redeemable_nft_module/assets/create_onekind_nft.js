const { BaseAsset } = require("lisk-sdk");
const { REDEEMABLE_NFT_CREATE_ONEKIND_NFT } = require("../constants/id");
const UTILITY = require("../constants/utility");
const RECURRING = require("../constants/recurring");
const NFTTYPE = require("../constants/nft_type");
const CreateOneKindNFTAssetSchema = require("../schemas/assets/create_onekind_nft");
const { generateID, getAllNFT, setAllNFT, getAllNFTContainer, setAllNFTContainer, setNFTById } = require("../utils/chain_state");
const CHAIN = require("../constants/chain");
const RARITY = require("../constants/rarity");
const JOURNEYACTIVITY = require("../constants/journey_activity");
const REDEEMSTATUS = require("../constants/redeem_status");
const { asyncForEach } = require("../utils/helper");

class CreateOneKindNFTAsset extends BaseAsset {
  name = "createOneKindNFTAsset";
  id = REDEEMABLE_NFT_CREATE_ONEKIND_NFT;
  schema = CreateOneKindNFTAssetSchema;

  validate({ asset }) {
    if (!asset.name || asset.name.length > 18) {
      throw new Error(`Invalid "asset.name" defined on transaction: Valid string is expected and Below 18 Char Length`);
    }
    if (!asset.description) {
      throw new Error(`Invalid "asset.description" defined on transaction: Valid string is expected`);
    }
    if (!asset.data) {
      throw new Error(`Invalid "asset.data" defined on transaction: Valid string is expected`);
    }
    if (!asset.utility || !Object.values(UTILITY).includes(asset.utility)) {
      throw new Error(`Invalid "asset.utility" defined on transaction: Valid string is expected or asset.utility is unknown`);
    }
    if (!asset.recurring || !Object.values(RECURRING).includes(asset.recurring)) {
      throw new Error(`Invalid "asset.recurring" defined on transaction: Valid string is expected or asset.recurring is unknown`);
    }
    if (asset.recurring === RECURRING.PERWEEK && !asset.time.day) {
      throw new Error(`Invalid "asset.time.day" defined on transaction: Day is required on recurring perweek, Valid number is expected`);
    }
    if (asset.recurring === RECURRING.PERMONTH && !asset.time.date) {
      throw new Error(`Invalid "asset.time.date" defined on transaction: Date is required on recurring permonth, Valid number is expected`);
    }
    if (asset.recurring === RECURRING.PERYEAR && (!asset.time.date || !asset.time.month)) {
      throw new Error(`Invalid "asset.time.date" or "asset.time.month" defined on transaction: Date and Month is required on recurring peryear, Valid number is expected`);
    }
    if (asset.recurring === RECURRING.ONCE && (!asset.time.date || !asset.time.month || !asset.time.year)) {
      throw new Error(`Invalid "asset.time.date" or "asset.time.month" defined on transaction: Date and Month is required on recurring peryear, Valid number is expected`);
    }
    if (!asset.from) {
      throw new Error(`Invalid "asset.from" defined on transaction: Valid string is expected`);
    }
    if (!asset.until) {
      throw new Error(`Invalid "asset.until" defined on transaction: Valid string is expected`);
    }
    if (!asset.limit || asset.limit < 1) {
      throw new Error(`Invalid "asset.limit" defined on transaction: Valid number greater than 1 is expected`);
    }
    if (!asset.price || asset.price < 0) {
      throw new Error(`Invalid "asset.price" defined on transaction: Valid non negative number is expected`);
    }
    if (!asset.quantity || asset.quantity < 1) {
      throw new Error(`Invalid "asset.quantity" defined on transaction: Valid number greater than 1 is expected`);
    }
    if (!asset.mintingExpire || asset.mintingExpire < Date.now()) {
      throw new Error(`Invalid "asset.mintingExpire" defined on transaction: Valid number is expected and can't be in the past`);
    }
    if (!asset.timestamp || typeof asset.timestamp !== "number" || asset.timestamp > Date.now()) {
      throw new Error(`Invalid "asset.timestamp" defined on transaction: Valid number is expected and can't be in the future`);
    }
  }

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const senderAddress = transaction.senderAddress;
    const allRegisteredNFT = await getAllNFT(stateStore);

    const allNFT = [];
    for (let i = 0; i < asset.quantity; i++) {
      const nft = {
        id: generateID(senderAddress, transaction.nonce + BigInt(i)),
        serial: asset.name + "-" + i.toString(),
        name: asset.name,
        description: asset.description,
        createdOn: asset.timestamp,
        data: asset.data,
        ownerAddress: senderAddress,
        originAddress: senderAddress,
        originChain: CHAIN.NAME,
        NFTType: NFTTYPE.ONEKIND,
        utility: asset.utility,
        redeem: {
          parts: [],
          partition: [],
          count: 0,
          message: "",
          status: REDEEMSTATUS.IDLE,
          recurring: asset.recurring,
          time: asset.time,
          from: asset.from,
          until: asset.until,
          limit: asset.limit,
        },
        rarity: RARITY.UNDEFINED,
        journey: [
          {
            activity: JOURNEYACTIVITY.CREATED,
            date: asset.timestamp,
            subject: senderAddress,
            from: "",
            message: "",
            amount: 0,
          },
        ],
        value: asset.price,
        onSale: false,
        royalty: {
          origin: "0",
          staker: "0",
        },
      };
      allNFT.push(nft);
      allRegisteredNFT.push(nft.id);
    }

    asyncForEach(allNFT, async (item) => {
      await setNFTById(stateStore, item.id, item);
    });

    const NFTContainer = {
      id: generateID(senderAddress, transaction.nonce),
      containerType: NFTTYPE.ONEKIND,
      allNFT: allNFT,
      NFTSold: [],
      availableItem: allNFT,
      mintingExpire: asset.mintingExpire,
      originAddress: senderAddress,
      price: asset.price,
      name: asset.name,
      description: asset.description,
      packSize: 1,
      createdOn: asset.timestamp,
    };

    const allNFTContainer = await getAllNFTContainer(stateStore);
    allNFTContainer.push(NFTContainer);

    await setAllNFTContainer(allNFTContainer);
    await setAllNFT(stateStore, allRegisteredNFT);
  }
}

module.exports = CreateOneKindNFTAsset;
