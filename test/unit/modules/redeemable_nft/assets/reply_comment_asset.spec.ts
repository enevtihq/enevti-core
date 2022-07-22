import { ReplyCommentAsset } from '../../../../../src/app/modules/redeemableNft/assets/reply_comment_asset';

describe('ReplyCommentAsset', () => {
  let transactionAsset: ReplyCommentAsset;

	beforeEach(() => {
		transactionAsset = new ReplyCommentAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(10);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('replyComment');
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
