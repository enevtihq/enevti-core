const { BaseAsset } = require("lisk-sdk");
const seedrandom = require("seedrandom");
const { REDEEMABLE_NFT_MINT_NFT } = require("../constants/id");
const JOURNEYACTIVITY = require("../constants/journey_activity");
const NFTTYPE = require("../constants/nft_type");
const MintNFTAssetSchema = require("../schemas/assets/mint_nft");
const { getNFTContainerById, getNFTPackById, setNFTPackById, getNFTById, setNFTById, setNFTContainerById } = require("../utils/chain_state");
const { asyncForEach } = require("../utils/helper");

class MintNFTAsset extends BaseAsset {
  name = "mintNFTAsset";
  id = REDEEMABLE_NFT_MINT_NFT;
  schema = MintNFTAssetSchema;

  validate({ asset }) {
    if (asset.quantity <= 0) {
      throw new Error(`asset.quantity must be greater than 0`);
    }
    if (asset.timestamp > Date.now()) {
      throw new Error(`asset.timestamp can't be in the future`);
    }
  }

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    let container = await getNFTContainerById(stateStore, asset.containerId);
    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);
    const rng = seedrandom(transaction.nonce);

    if (!container) {
      throw new Error("NFT Container doesn't exist");
    }

    if (container.mintingExpire !== -1) {
      const blockHeight = await stateStore.chain.lastBlockHeaders.height;
      if (container.mintingExpire < blockHeight) {
        throw new Error("minting expired");
      }
    }

    if (container.availableItem.length < asset.quantity) {
      throw new Error("quantity unavailable");
    }

    let boughtItem = [];
    for (let i = 0; i < asset.quantity; i++) {
      switch (container.containerType) {
        case NFTTYPE.ONEKIND:
          boughtItem.unshift(container.availableItem[0]);
          container.NFTSold.push(container.availableItem[0]);
          container.availableItem.shift();
          break;
        case NFTTYPE.UPGRADABLE:
          boughtItem.unshift(container.availableItem[0]);
          container.NFTSold.push(container.availableItem[0]);
          container.availableItem.shift();
          break;
        case NFTTYPE.PACKED:
          const index = Math.floor(rng() * container.availableItem.length);
          const item = container.availableItem[index];
          const itemIndex = container.availableItem.findIndex((t) => t.equals(item));
          let packItem = await getNFTPackById(stateStore, item);
          container.availableItem.splice(itemIndex, 1);
          boughtItem = boughtItem.concat(packItem.NFTItem);
          container.NFTSold = container.NFTSold.concat(packItem.NFTItem);
          packItem.boughtBy = senderAddress;
          await setNFTPackById(stateStore, packItem.id, packItem);
          break;
        default:
          throw new Error("FATAL: unkown container type");
      }
    }

    asyncForEach(boughtItem, (item) => {
      const nft = await getNFTById(stateStore, item);
      nft.ownerAddress = senderAddress;
      nft.journey.unshift({
        activity: JOURNEYACTIVITY.MINTED,
        date: asset.timestamp,
        by: senderAddress,
        from: container.originAddress,
        message: `${container.name} Pack`,
        amount: 0,
      });
      senderAccount.redeemableNFT.ownNFTs.push(nft.id);
      await stateStore.account.set(senderAddress, senderAccount);
      await setNFTById(stateStore, nft.id, nft);
    });

    await setNFTContainerById(stateStore, container.id, container);

    await reducerHandler.invoke("token:debit", {
      address: senderAddress,
      amount: container.price.amount,
    });

    await reducerHandler.invoke("token:credit", {
      address: container.originAddress,
      amount: container.price.amount,
    });
  }
}

module.exports = MintNFTAsset;
