export type IPFSTextCache = {
  text: string;
};

export const ipfsTextCacheSchema = {
  $id: 'ipfs/ipfsTextCacheSchema',
  type: 'object',
  required: ['text'],
  properties: {
    text: {
      fieldNumber: 1,
      dataType: 'string',
    },
  },
};
