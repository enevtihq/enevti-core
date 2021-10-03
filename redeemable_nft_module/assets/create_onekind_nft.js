const { BaseAsset } = require("lisk-sdk");
const { REDEEMABLE_NFT_CREATE_ONEKIND_NFT } = require("../constants/id");
const UTILITY = require("../constants/utility");
const RECURRING = require("../constants/recurring");
const NFTTYPE = require("../constants/nft_type");
const CreateOneKindNFTAssetSchema = require("../schemas/assets/create_onekind_nft");
const { generateID, getAllNFT, setAllNFT, getAllNFTContainer, setAllNFTContainer, setNFTById, setNFTContainerById } = require("../utils/chain_state");
const CHAIN = require("../constants/chain");
const RARITY = require("../constants/rarity");
const JOURNEYACTIVITY = require("../constants/journey_activity");
const REDEEMSTATUS = require("../constants/redeem_status");
const { asyncForEach } = require("../utils/helper");
const CreateOneKindNFTValidator = require("../external-validator/create_onekind_nft");

class CreateOneKindNFTAsset extends BaseAsset {
  name = "createOneKindNFTAsset";
  id = REDEEMABLE_NFT_CREATE_ONEKIND_NFT;
  schema = CreateOneKindNFTAssetSchema;

  validate({ asset }) {
    if (asset.name.length > 18) {
      throw new Error(`asset.name must be below 18 char length`);
    }
    if (!Object.values(UTILITY).includes(asset.utility)) {
      throw new Error(`asset.utility is unknown`);
    }
    if (!Object.values(RECURRING).includes(asset.recurring)) {
      throw new Error(`asset.recurring is unknown`);
    }
    if (asset.recurring === RECURRING.PERWEEK && asset.time.day < 0) {
      throw new Error(`asset.time.day is required on recurring perweek`);
    }
    if (asset.recurring === RECURRING.PERMONTH && asset.time.date <= 0) {
      throw new Error(`asset.time.date is required on recurring permonth`);
    }
    if (asset.recurring === RECURRING.PERYEAR && (asset.time.date <= 0 || asset.time.month <= 0)) {
      throw new Error(`asset.time.date and asset.time.month are required on recurring peryear`);
    }
    if (asset.recurring === RECURRING.ONCE && (asset.time.date <= 0 || asset.time.month <= 0 || asset.time.year <= 0)) {
      throw new Error(`asset.time.date, asset.time.month, and asset.time.year are required on recurring once`);
    }
    if (asset.redeemLimit <= 0) {
      throw new Error(`asset.redeemLimit must be greater than 0`);
    }
    if (asset.price <= 0) {
      throw new Error(`asset.price must be greater than 0`);
    }
    if (asset.quantity <= 0) {
      throw new Error(`asset.quantity must be greater than 0`);
    }
    if (asset.until <= BigInt(0)) {
      throw new Error(`asset.quantity must be greater than 0`);
    }
    if (asset.mintingExpire !== -1 && asset.mintingExpire <= 10000) {
      throw new Error(`valid asset.mintingExpire is in milliseconds and must be greater than 10000 (10 sec)`);
    }
    if (asset.royalty.origin <= 0) {
      throw new Error(`asset.royalty.origin must be greater than 0`);
    }
    if (asset.royalty.staker <= 0) {
      throw new Error(`asset.royalty.staker must be greater than 0`);
    }
  }

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const senderAddress = transaction.senderAddress;
    const allRegisteredNFT = await getAllNFT(stateStore);
    const timestampInSec = await stateStore.chain.lastBlockHeaders[0].timestamp;

    const externalValidation = CreateOneKindNFTValidator(asset, stateStore, reducerHandler, transaction);
    if (externalValidation.status !== true) {
      throw new Error(`Error during external validation: ${externalValidation.message}`);
    }

    const allNFT = [];
    for (let i = 0; i < asset.quantity; i++) {
      const nft = {
        id: generateID(senderAddress, transaction.nonce + BigInt(i + 1)),
        serial: asset.name + "-" + i.toString(),
        name: asset.name,
        description: asset.description,
        createdOn: timestampInSec,
        data: asset.data,
        ownerAddress: "",
        originAddress: senderAddress,
        originChain: CHAIN.NAME,
        NFTType: NFTTYPE.ONEKIND,
        utility: asset.utility,
        redeem: {
          parts: [],
          partition: [],
          count: 0,
          message: {
            cipher: "",
            nonce: "",
          },
          status: REDEEMSTATUS.IDLE,
          recurring: asset.recurring,
          time: asset.time,
          from: asset.from,
          until: asset.until,
          limit: asset.redeemLimit,
        },
        rarity: RARITY.UNDEFINED,
        journey: [
          {
            activity: JOURNEYACTIVITY.CREATED,
            date: timestampInSec,
            by: senderAddress,
            from: "",
            message: "",
            amount: 0,
          },
        ],
        price: {
          amount: asset.price.amount,
          currency: asset.price.currency,
        },
        onSale: false,
        royalty: {
          origin: asset.royalty.origin,
          staker: asset.royalty.staker,
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
      mintingExpire: asset.mintingExpire === -1 ? -1 : Math.floor(asset.mintingExpire / 1000),
      originAddress: senderAddress,
      price: {
        amount: asset.price.amount,
        currency: asset.price.currency,
      },
      name: asset.name,
      description: asset.description,
      packSize: 1,
      createdOn: timestampInSec,
    };

    const allNFTContainer = await getAllNFTContainer(stateStore);
    allNFTContainer.push(NFTContainer);

    await setNFTContainerById(stateStore, NFTContainer.id, NFTContainer);
    await setAllNFTContainer(allNFTContainer);
    await setAllNFT(stateStore, allRegisteredNFT);
  }
}

module.exports = CreateOneKindNFTAsset;
