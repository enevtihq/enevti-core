import { MintNftTypeQrAsset } from '../../../../../src/app/modules/redeemable_nft/assets/mint_nft_type_qr_asset';

describe('MintNftTypeQrAsset', () => {
  let transactionAsset: MintNftTypeQrAsset;

  beforeEach(() => {
    transactionAsset = new MintNftTypeQrAsset();
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(transactionAsset.id).toEqual(3);
    });

    it('should have valid name', () => {
      expect(transactionAsset.name).toEqual('mintNftTypeQr');
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
