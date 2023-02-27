import { AddCommentAsset } from '../../../../../src/app/modules/comment/assets/add_comment_asset';

describe('AddCommentAsset', () => {
  let transactionAsset: AddCommentAsset;

	beforeEach(() => {
		transactionAsset = new AddCommentAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(0);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('addComment');
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
