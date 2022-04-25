import { ChangeTwitterAsset } from '../../../../../src/app/modules/persona/assets/change_twitter_asset';

describe('ChangeTwitterAsset', () => {
  let transactionAsset: ChangeTwitterAsset;

  beforeEach(() => {
    transactionAsset = new ChangeTwitterAsset();
  });

  describe('constructor', () => {
    it('should have valid id', () => {
      expect(transactionAsset.id).toEqual(1);
    });

    it('should have valid name', () => {
      expect(transactionAsset.name).toEqual('changeTwitter');
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
