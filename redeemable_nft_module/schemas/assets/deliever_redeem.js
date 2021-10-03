const DeliverRedeemAssetSchema = {
  $id: "enevti/redeemable_nft/deliver_redeem",
  type: "object",
  required: ["nftId", "resource"],
  properties: {
    nftId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    resource: {
      dataType: "string",
      fieldNumber: 2,
    },
  },
};

module.exports = DeliverRedeemAssetSchema;
