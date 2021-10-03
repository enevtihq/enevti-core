const CreatePackedNFTAssetSchema = {
  $id: "enevti/redeemable_nft/createPackedNFT",
  type: "object",
  required: ["name", "description", "price", "packSize", "item"],
  properties: {
    name: {
      dataType: "string",
      fieldNumber: 1,
    },
    description: {
      dataType: "string",
      fieldNumber: 2,
    },
    price: {
      type: "object",
      required: ["amount", "currency"],
      fieldNumber: 3,
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
    packSize: {
      dataType: "uint32",
      fieldNumber: 4,
    },
    item: {
      type: "array",
      fieldNumber: 5,
      items: {
        type: "object",
        required: ["data", "utility", "quantity", "partitionSize", "recurring", "time", "from", "until", "redeemLimit", "royalty"],
        properties: {
          data: {
            type: "array",
            fieldNumber: 1,
            items: {
              dataType: "string",
            },
          },
          utility: {
            dataType: "string",
            fieldNumber: 2,
          },
          quantity: {
            dataType: "uint32",
            fieldNumber: 3,
          },
          partitionSize: {
            dataType: "uint32",
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
            type: "object",
            required: ["hour", "minute"],
            fieldNumber: 7,
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
        },
      },
    },
  },
};

module.exports = CreatePackedNFTAssetSchema;
