const CHAIN_STATE_ALL_NFT = "redeemable_nft_chain:all_nft";
const CHAIN_STATE_NFT = "redeemable_nft_chain";
const CHAIN_STATE_ALL_CONTAINER = "redeemable_nft_container:all_container";
const CHAIN_STATE_CONTAINER = "redeemable_nft_container";
const CHAIN_STATE_NFTPACK = "redeemable_nft_pack";
const CHAIN_STATE_REDEEM_STATUS_MONITOR = "redeemable_nft_monitor";

const redeemableNFTSchema = {
  $id: "enevti/redeemable_nft/nft",
  type: "object",
  required: ["id", "serial", "name", "description", "createdOn", "data", "ownerAddress", "originAddress", "originChain", "NFTType", "utility", "redeem", "rarity", "journey", "value", "onSale", "royalty"],
  properties: {
    id: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    serial: {
      dataType: "string",
      fieldNumber: 2,
    },
    name: {
      dataType: "string",
      fieldNumber: 3,
    },
    description: {
      dataType: "string",
      fieldNumber: 4,
    },
    createdOn: {
      dataType: "uint32",
      fieldNumber: 5,
    },
    data: {
      dataType: "string",
      fieldNumber: 6,
    },
    ownerAddress: {
      dataType: "bytes",
      fieldNumber: 7,
    },
    originAddress: {
      dataType: "bytes",
      fieldNumber: 8,
    },
    originChain: {
      dataType: "string",
      fieldNumber: 9,
    },
    NFTType: {
      dataType: "string",
      fieldNumber: 10,
    },
    utility: {
      dataType: "string",
      fieldNumber: 11,
    },
    redeem: {
      type: "object",
      required: ["parts", "partition", "count", "message", "status", "recurring", "time", "from", "until", "limit", "touched"],
      fieldNumber: 12,
      properties: {
        parts: {
          type: "array",
          fieldNumber: 1,
          items: {
            dataType: "bytes",
          },
        },
        partition: {
          dataType: "uint32",
          fieldNumber: 2,
        },
        count: {
          dataType: "uint32",
          fieldNumber: 3,
        },
        message: {
          type: "object",
          required: ["cipher", "nonce"],
          fieldNumber: 4,
          properties: {
            cipher: {
              dataType: "string",
              fieldNumber: 1,
            },
            nonce: {
              dataType: "string",
              fieldNumber: 2,
            },
          },
        },
        status: {
          dataType: "string",
          fieldNumber: 5,
        },
        recurring: {
          dataType: "string",
          fieldNumber: 6,
        },
        time: {
          type: "object",
          fieldNumber: 7,
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
          type: "object",
          required: ["hour", "minute"],
          fieldNumber: 8,
          properties: {
            hour: {
              dataType: "uint32",
              fieldNumber: 1,
            },
            minute: {
              dataType: "uint32",
              fieldNumber: 2,
            },
          },
        },
        until: {
          dataType: "uint32",
          fieldNumber: 9,
        },
        limit: {
          dataType: "uint32",
          fieldNumber: 10,
        },
        touched: {
          dataType: "uint32",
          fieldNumber: 11,
        },
      },
    },
    rarity: {
      dataType: "uint32",
      fieldNumber: 13,
    },
    journey: {
      type: "array",
      fieldNumber: 14,
      items: {
        activity: {
          dataType: "string",
          fieldNumber: 1,
        },
        date: {
          dataType: "uint32",
          fieldNumber: 2,
        },
        by: {
          dataType: "bytes",
          fieldNumber: 3,
        },
        from: {
          dataType: "bytes",
          fieldNumber: 4,
        },
        message: {
          dataType: "string",
          fieldNumber: 5,
        },
        amount: {
          dataType: "uint64",
          fieldNumber: 6,
        },
      },
    },
    price: {
      type: "object",
      required: ["amount", "currency"],
      fieldNumber: 15,
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
    onSale: {
      dataType: "boolean",
      fieldNumber: 16,
    },
    royalty: {
      type: "object",
      properties: {
        origin: {
          dataType: "uint32",
          fieldNumber: 1,
        },
        staker: {
          dataType: "uin32",
          fieldNumber: 2,
        },
      },
    },
  },
};

const NFTContainerSchema = {
  $id: "enevti/redeemable_nft/nft_container",
  type: "object",
  required: ["id", "containerType", "allNFT", "NFTSold", "availableItem", "mintingExpire", "originAddress", "price", "name", "description", "packSize", "createdOn"],
  properties: {
    id: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    containerType: {
      dataType: "string",
      fieldNumber: 2,
    },
    allNFT: {
      type: "array",
      fieldNumber: 3,
      items: {
        dataType: "bytes",
      },
    },
    NFTSold: {
      type: "array",
      fieldNumber: 4,
      items: {
        dataType: "bytes",
      },
    },
    availableItem: {
      type: "array",
      fieldNumber: 5,
      items: {
        dataType: "bytes",
      },
    },
    mintingExpire: {
      dataType: "uint32",
      fieldNumber: 6,
    },
    originAddress: {
      dataType: "bytes",
      fieldNumber: 7,
    },
    price: {
      type: "object",
      fieldNumber: 8,
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
    name: {
      dataType: "string",
      fieldNumber: 9,
    },
    description: {
      dataType: "string",
      fieldNumber: 10,
    },
    packSize: {
      dataType: "uint32",
      fieldNumber: 11,
    },
    createdOn: {
      dataType: "uint32",
      fieldNumber: 12,
    },
  },
};

const NFTPackSchema = {
  $id: "enevti/redeemable_nft/nft_pack",
  type: "object",
  required: ["id", "NFTItem", "parentContainer", "boughtBy"],
  properties: {
    id: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    NFTItem: {
      type: "array",
      fieldNumber: 2,
      items: {
        dataType: "bytes",
      },
    },
    parentContainer: {
      dataType: "bytes",
      fieldNumber: 3,
    },
    boughtBy: {
      dataType: "bytes",
      fieldNumber: 4,
    },
  },
};

const allNFTSchema = {
  $id: "enevti/redeemable_nft/all_nft",
  type: "object",
  required: ["allNFT"],
  properties: {
    allNFT: {
      type: "array",
      fieldNumber: 1,
      items: {
        dataType: "bytes",
      },
    },
  },
};

const allNFTContainerSchema = {
  $id: "enevti/redeemable_nft/all_nft_container",
  type: "object",
  required: ["allNFTContainer"],
  properties: {
    allNFTContainer: {
      type: "array",
      fieldNumber: 1,
      items: {
        dataType: "bytes",
      },
    },
  },
};

const redeemMonitorSchema = {
  $id: "enevti/redeemable_nft/redeem_monitor",
  type: "object",
  required: ["checkpoint", "all"],
  properties: {
    checkpoint: {
      type: "object",
      required: ["time", "nft"],
      fieldNumber: 1,
      properties: {
        time: {
          dataType: "uint32",
          fieldNumber: 1,
        },
        nft: {
          type: "array",
          fieldNumber: 2,
          items: {
            dataType: "bytes",
          },
        },
      },
    },
    all: {
      type: "array",
      fieldNumber: 2,
      items: redeemableNFTSchema,
    },
  },
};

module.exports = {
  redeemableNFTSchema,
  NFTContainerSchema,
  NFTPackSchema,
  allNFTSchema,
  allNFTContainerSchema,
  redeemMonitorSchema,
  CHAIN_STATE_ALL_NFT,
  CHAIN_STATE_NFT,
  CHAIN_STATE_ALL_CONTAINER,
  CHAIN_STATE_CONTAINER,
  CHAIN_STATE_NFTPACK,
  CHAIN_STATE_REDEEM_STATUS_MONITOR,
};
