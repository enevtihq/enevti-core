const CreateOneKindNFTAssetSchema = {
  $id: "enevti/redeemable_nft/createOneKindNFT",
  type: "object",
  required: ["name", "description", "data", "utility", "recurring", "time", "from", "until", "redeemLimit", "royalty", "price", "quantity", "mintingExpire", "timestamp"],
  properties: {
    name: {
      dataType: "string",
      fieldNumber: 1,
    },
    description: {
      dataType: "string",
      fieldNumber: 2,
    },
    data: {
      dataType: "string",
      fieldNumber: 3,
    },
    utility: {
      dataType: "string",
      fieldNumber: 4,
    },
    recurring: {
      dataType: "string",
      fieldNumber: 5,
    },
    time: {
      type: "object",
      required: ["day", "date", "month", "year"],
      fieldNumber: 6,
      properties: {
        day: {
          dataType: "uint32",
          fieldNumber: 1,
        },
        date: {
          dataType: "uint32",
          fieldNumber: 2,
        },
        month: {
          dataType: "uint32",
          fieldNumber: 3,
        },
        year: {
          dataType: "uint32",
          fieldNumber: 4,
        },
      },
    },
    from: {
      dataType: "string",
      fieldNumber: 7,
    },
    until: {
      dataType: "string",
      fieldNumber: 8,
    },
    redeemLimit: {
      dataType: "uint32",
      fieldNumber: 9,
    },
    royalty: {
      type: "object",
      required: ["origin", "staker"],
      fieldNumber: 10,
      properties: {
        origin: {
          dataType: "uint32",
          fieldNumber: 1,
        },
        staker: {
          dataType: "uint32",
          fieldNumber: 2,
        },
      },
    },
    price: {
      type: "object",
      required: ["amount", "currency"],
      fieldNumber: 11,
      properties: {
        amount: {
          dataType: "uint64",
          fieldNumber: 1,
        },
        currency: {
          dataType: "string",
          fieldNumber: 2,
        },
      },
    },
    quantity: {
      dataType: "uint32",
      fieldNumber: 12,
    },
    mintingExpire: {
      dataType: "uint32",
      fieldNumber: 13,
    },
    timestamp: {
      dataType: "uint32",
      fieldNumber: 14,
    },
  },
};

module.exports = CreateOneKindNFTAssetSchema;
