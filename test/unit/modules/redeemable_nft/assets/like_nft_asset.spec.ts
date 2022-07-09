import { LikeNftAsset } from '../../../../../src/app/modules/redeemableNft/assets/like_nft_asset';

describe('LikeNftAsset', () => {
  let transactionAsset: LikeNftAsset;

	beforeEach(() => {
		transactionAsset = new LikeNftAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(4);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('likeNft');
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
