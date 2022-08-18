import { LikeReplyClubsAsset } from '../../../../../src/app/modules/redeemableNft/assets/like_reply_clubs_asset';

describe('LikeReplyClubsAsset', () => {
  let transactionAsset: LikeReplyClubsAsset;

	beforeEach(() => {
		transactionAsset = new LikeReplyClubsAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(14);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('likeReplyClubs');
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
