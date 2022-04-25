export const changeTwitterAssetSchema = {
  $id: 'enevti/persona/changeTwitterAsset',
  title: 'ChangeTwitterAsset transaction asset for persona module',
  type: 'object',
  required: ['twitter'],
  properties: {
    twitter: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
};
