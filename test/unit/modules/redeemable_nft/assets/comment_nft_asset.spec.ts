import { CommentNftAsset } from '../../../../../src/app/modules/redeemableNft/assets/comment_nft_asset';

describe('CommentNftAsset', () => {
  let transactionAsset: CommentNftAsset;

	beforeEach(() => {
		transactionAsset = new CommentNftAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(6);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('commentNft');
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
