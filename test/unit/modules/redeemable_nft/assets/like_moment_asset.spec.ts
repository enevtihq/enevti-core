import { LikeMomentAsset } from '../../../../../src/app/modules/redeemable_nft/assets/like_moment_asset';

describe('LikeMomentAsset', () => {
  // let transactionAsset: LikeMomentAsset;

  // beforeEach(() => {
  //   transactionAsset = new LikeMomentAsset();
  // });

  // describe('constructor', () => {
  //   it('should have valid id', () => {
  //     expect(transactionAsset.id).toEqual(21);
  //   });

  //   it('should have valid name', () => {
  //     expect(transactionAsset.name).toEqual('likeMoment');
  //   });

  //   it('should have valid schema', () => {
  //     expect(transactionAsset.schema).toMatchSnapshot();
  //   });
  // });

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
