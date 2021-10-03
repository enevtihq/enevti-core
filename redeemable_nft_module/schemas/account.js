const RedeemableNFTAccountSchema = {
  type: "object",
  required: ["ownNFTs", "collector", "creator"],
  properties: {
    ownNFTs: {
      type: "array",
      fieldNumber: 1,
      items: {
        dataType: "bytes",
      },
    },
    collector: {
      type: "object",
      required: ["onSale", "redeemed"],
      fieldNumber: 2,
      properties: {
        onSale: {
          dataType: "boolean",
          fieldNumber: 1,
        },
        redeemed: {
          type: "object",
          required: ["total", "detail"],
          fieldNumber: 2,
          properties: {
            total: {
              dataType: "uint32",
              fieldNumber: 1,
            },
            detail: {
              type: "array",
              fieldNumber: 2,
              items: {
                type: "object",
                properties: {
                  originAddress: {
                    dataType: "bytes",
                    fieldNumber: 1,
                  },
                  count: {
                    dataType: "uint32",
                    fieldNumber: 2,
                  },
                },
              },
            },
          },
        },
      },
    },
    creator: {
      type: "object",
      required: ["requestQueue", "available", "minted", "delivered", "rejected", "timeout"],
      fieldNumber: 3,
      properties: {
        requestQueue: {
          type: "array",
          fieldNumber: 1,
          items: {
            dataType: "bytes",
          },
        },
        available: {
          type: "array",
          fieldNumber: 2,
          items: {
            dataType: "bytes",
          },
        },
        minted: {
          dataType: "uint32",
          fieldNumber: 3,
        },
        delivered: {
          dataType: "uint32",
          fieldNumber: 4,
        },
        rejected: {
          dataType: "uint32",
          fieldNumber: 5,
        },
        timeout: {
          dataType: "uint32",
          fieldNumber: 6,
        },
      },
    },
  },
  default: {
    ownNFTs: [],
    collector: {
      onSale: false,
      redeemed: {
        total: 0,
        detail: [],
      },
    },
    creator: {
      requestQueue: [],
      available: [],
      minted: 0,
      delivered: 0,
      rejected: 0,
      timeout: 0,
    },
  },
};

module.exports = {
  RedeemableNFTAccountSchema,
};
