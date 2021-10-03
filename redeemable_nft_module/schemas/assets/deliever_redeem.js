const DeliverRedeemAssetSchema = {
  $id: "enevti/redeemable_nft/deliver_redeem",
  type: "object",
  required: ["nftId", "resource"],
  properties: {
    nftId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    cipher: {
      dataType: "string",
      fieldNumber: 2,
    },
    nonce: {
      dataType: "string",
      fieldNumber: 3,
    },
  },
};

module.exports = DeliverRedeemAssetSchema;
