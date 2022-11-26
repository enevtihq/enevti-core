import { MintMomentAsset } from '../../../../../src/app/modules/redeemable_nft/assets/mint_moment_asset';

describe('MintMomentAsset', () => {
  let transactionAsset: MintMomentAsset;

  beforeEach(() => {
    transactionAsset = new MintMomentAsset();
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(transactionAsset.id).toEqual(18);
    });

    it('should have valid name', () => {
      expect(transactionAsset.name).toEqual('mintMoment');
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
