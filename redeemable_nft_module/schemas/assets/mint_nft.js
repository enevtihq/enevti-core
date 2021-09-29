const MintNFTAssetSchema = {
  $id: "enevti/redeemable_nft/mintNFT",
  type: "object",
  required: ["containerId", "quantity"],
  properties: {
    containerId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    quantity: {
      dataType: "uint32",
      fieldNumber: 2,
    },
    timestamp: {
      dataType: "uint32",
      fieldNumber: 3,
    },
  },
};

module.exports = MintNFTAssetSchema;
