import { RegistrarAsset } from 'enevti-types/chain/registrar';
import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { REGISTRAR_PREFIX } from '../constants/codec';

export const registrarSchema: StateSchemaFromType<RegistrarAsset> = {
  $id: `enevti/${REGISTRAR_PREFIX}`,
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};
