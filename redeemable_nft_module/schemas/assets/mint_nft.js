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
  },
};

module.exports = MintNFTAssetSchema;
