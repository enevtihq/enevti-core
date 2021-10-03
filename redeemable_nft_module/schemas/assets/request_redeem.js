const RequestRedeemAssetSchema = {
  $id: "enevti/redeemable_nft/request_redeem",
  type: "object",
  required: ["nftId"],
  properties: {
    nftId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
  },
};

module.exports = RequestRedeemAssetSchema;
