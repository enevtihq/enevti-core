const RejectRedeemAssetSchema = {
  $id: "enevti/redeemable_nft/reject_redeem",
  type: "object",
  required: ["nftId"],
  properties: {
    nftId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
  },
};

module.exports = RejectRedeemAssetSchema;
