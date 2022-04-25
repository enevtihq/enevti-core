import { ChangePhotoAsset } from '../../../../../src/app/modules/persona/assets/change_photo_asset';

describe('ChangePhotoAsset', () => {
  let transactionAsset: ChangePhotoAsset;

  beforeEach(() => {
    transactionAsset = new ChangePhotoAsset();
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(transactionAsset.id).toEqual(0);
    });

    it('should have valid name', () => {
      expect(transactionAsset.name).toEqual('changePhoto');
    });

    it('should have valid schema', () => {
      expect(transactionAsset.schema).toMatchSnapshot();
    });
  });

  describe('validate', () => {
    describe('schema validation', () => {
      it.todo('should throw errors for invalid schema');
      it.todo('should be ok for valid schema');
    });
  });

  describe('apply', () => {
    describe('valid cases', () => {
      it.todo('should update the state store');
    });

    describe('invalid cases', () => {
      it.todo('should throw error');
    });
  });
});
