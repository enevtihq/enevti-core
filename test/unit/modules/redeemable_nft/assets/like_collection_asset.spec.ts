import { LikeCollectionAsset } from '../../../../../src/app/modules/redeemableNft/assets/like_collection_asset';

describe('LikeCollectionAsset', () => {
  let transactionAsset: LikeCollectionAsset;

	beforeEach(() => {
		transactionAsset = new LikeCollectionAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(5);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('likeCollection');
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
