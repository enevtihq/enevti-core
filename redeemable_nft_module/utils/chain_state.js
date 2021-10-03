const { codec, cryptography } = require("lisk-sdk");
const {
  CHAIN_STATE_ALL_NFT,
  allNFTSchema,
  CHAIN_STATE_NFT,
  redeemableNFTSchema,
  CHAIN_STATE_ALL_CONTAINER,
  allNFTContainerSchema,
  CHAIN_STATE_CONTAINER,
  NFTContainerSchema,
  CHAIN_STATE_NFTPACK,
  NFTPackSchema,
  CHAIN_STATE_REDEEM_STATUS_MONITOR,
  redeemMonitorSchema,
} = require("../schemas/chain");

const generateID = (source, nonce) => {
  const nonceBuffer = Buffer.alloc(8);
  nonceBuffer.writeBigInt64LE(nonce);
  const seed = Buffer.concat([source, nonceBuffer]);
  return cryptography.hash(seed);
};

const getAllNFT = async (stateStore) => {
  const registeredTokensBuffer = await stateStore.chain.get(CHAIN_STATE_ALL_NFT);
  if (!registeredTokensBuffer) {
    return null;
  }

  const registeredTokens = codec.decode(allNFTSchema, registeredTokensBuffer);

  return registeredTokens;
};

const setAllNFT = async (stateStore, NFT) => {
  const registeredTokens = {
    allNFT: NFT.allNFT.sort((a, b) => a.id.compare(b.id)),
  };

  await stateStore.chain.set(CHAIN_STATE_ALL_NFT, codec.encode(allNFTSchema, registeredTokens));
};

const getNFTById = async (stateStore, id) => {
  const NFTBuffer = await stateStore.chain.get(CHAIN_STATE_NFT.concat(":", id.toString("hex")));
  if (!NFTBuffer) {
    return null;
  }

  return codec.decode(redeemableNFTSchema, NFTBuffer);
};

const setNFTById = async (stateStore, id, nft) => {
  await stateStore.chain.set(CHAIN_STATE_NFT.concat(":", id.toString("hex")), codec.encode(redeemableNFTSchema, nft));
};

const getAllNFTContainer = async (stateStore) => {
  const nftContainerBuffer = await stateStore.chain.get(CHAIN_STATE_ALL_CONTAINER);
  if (!nftContainerBuffer) {
    return null;
  }

  const nftContainer = codec.decode(allNFTContainerSchema, nftContainerBuffer);

  return nftContainer;
};

const setAllNFTContainer = async (stateStore, NFTContainer) => {
  const nftContainer = {
    allNFTContainer: NFTContainer.allNFTContainer.sort((a, b) => a.id.compare(b.id)),
  };

  await stateStore.chain.set(CHAIN_STATE_ALL_CONTAINER, codec.encode(allNFTContainerSchema, nftContainer));
};

const getNFTContainerById = async (stateStore, id) => {
  const nftContainerBuffer = await stateStore.chain.get(CHAIN_STATE_CONTAINER.concat(":", id.toString("hex")));
  if (!nftContainerBuffer) {
    return null;
  }

  return codec.decode(NFTContainerSchema, nftContainerBuffer);
};

const setNFTContainerById = async (stateStore, id, nftcontainer) => {
  await stateStore.chain.set(CHAIN_STATE_CONTAINER.concat(":", id.toString("hex")), codec.encode(NFTContainerSchema, nftcontainer));
};

const getNFTPackById = async (stateStore, id) => {
  const nftPackBuffer = await stateStore.chain.get(CHAIN_STATE_NFTPACK.concat(":", id.toString("hex")));
  if (!nftPackBuffer) {
    return null;
  }

  return codec.decode(NFTPackSchema, nftPackBuffer);
};

const setNFTPackById = async (stateStore, id, nftpack) => {
  await stateStore.chain.set(CHAIN_STATE_NFTPACK.concat(":", id.toString("hex")), codec.encode(NFTPackSchema, nftpack));
};

const getRedeemMonitor = async (stateStore) => {
  const redeemMonitorBuffer = await stateStore.chain.get(CHAIN_STATE_REDEEM_STATUS_MONITOR);
  if (!redeemMonitorBuffer) {
    return null;
  }

  return codec.decode(redeemMonitorSchema, redeemMonitorBuffer);
};

const setRedeemMonitor = async (stateStore, redeemMonitor) => {
  await stateStore.chain.set(CHAIN_STATE_REDEEM_STATUS_MONITOR, codec.encode(redeemMonitorSchema, redeemMonitor));
};

module.exports = {
  generateID,
  getAllNFT,
  setAllNFT,
  getNFTById,
  setNFTById,
  getAllNFTContainer,
  setAllNFTContainer,
  getNFTContainerById,
  setNFTContainerById,
  getNFTPackById,
  setNFTPackById,
  getRedeemMonitor,
  setRedeemMonitor,
};
