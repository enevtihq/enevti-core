import { DeliverSecretAsset } from '../../../../../src/app/modules/redeemableNft/assets/deliver_secret_asset';

describe('DeliverSecretAsset', () => {
  let transactionAsset: DeliverSecretAsset;

  beforeEach(() => {
    transactionAsset = new DeliverSecretAsset();
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(transactionAsset.id).toEqual(2);
    });

    it('should have valid name', () => {
      expect(transactionAsset.name).toEqual('deliverSecret');
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
