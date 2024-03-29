import { CreateOnekindNftAsset } from '../../../../../src/app/modules/redeemable_nft/assets/create_onekind_nft_asset';

describe('CreateOnekindNftAsset', () => {
  let transactionAsset: CreateOnekindNftAsset;

  beforeEach(() => {
    transactionAsset = new CreateOnekindNftAsset();
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(transactionAsset.id).toEqual(0);
    });

    it('should have valid name', () => {
      expect(transactionAsset.name).toEqual('createOnekindNft');
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
