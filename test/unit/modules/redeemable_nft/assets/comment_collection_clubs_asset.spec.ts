import { CommentCollectionClubsAsset } from '../../../../../src/app/modules/redeemable_nft/assets/comment_collection_clubs_asset';

describe('CommentCollectionClubsAsset', () => {
  let transactionAsset: CommentCollectionClubsAsset;

  beforeEach(() => {
    transactionAsset = new CommentCollectionClubsAsset();
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(transactionAsset.id).toEqual(11);
    });

    it('should have valid name', () => {
      expect(transactionAsset.name).toEqual('commentCollectionClubs');
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
