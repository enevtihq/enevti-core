import { AddExclusiveCommentAsset } from '../../../../../src/app/modules/nft_exclusive_comment/assets/add_exclusive_comment_asset';

describe('AddExclusiveCommentAsset', () => {
  let transactionAsset: AddExclusiveCommentAsset;

  beforeEach(() => {
    transactionAsset = new AddExclusiveCommentAsset();
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(transactionAsset.id).toEqual(0);
    });

    it('should have valid name', () => {
      expect(transactionAsset.name).toEqual('addExclusiveComment');
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
