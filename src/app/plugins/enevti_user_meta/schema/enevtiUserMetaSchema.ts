export type EnevtiUserMeta = {
  locale: string;
  os: 'android' | 'ios';
};

export const enevtiUserMetaSchema = {
  $id: 'enevti/userMeta',
  type: 'object',
  required: ['locale', 'os'],
  properties: {
    locale: {
      fieldNumber: 1,
      dataType: 'string',
    },
    os: {
      fieldNumber: 2,
      dataType: 'string',
    },
  },
};
