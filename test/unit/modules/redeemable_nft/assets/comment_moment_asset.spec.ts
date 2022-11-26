import { CommentMomentAsset } from '../../../../../src/app/modules/redeemable_nft/assets/comment_moment_asset';

describe('CommentMomentAsset', () => {
  let transactionAsset: CommentMomentAsset;

  beforeEach(() => {
    transactionAsset = new CommentMomentAsset();
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(transactionAsset.id).toEqual(19);
    });

    it('should have valid name', () => {
      expect(transactionAsset.name).toEqual('commentMoment');
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
