export const changePhotoAssetSchema = {
  $id: 'enevti/persona/changePhotoAsset',
  title: 'ChangePhotoAsset transaction asset for persona module',
  type: 'object',
  required: ['photo'],
  properties: {
    photo: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
};
