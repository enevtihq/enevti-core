import { SetVideoCallAnsweredAsset } from '../../../../../src/app/modules/redeemableNft/assets/set_video_call_answered_asset';

describe('SetVideoCallAnsweredAsset', () => {
  let transactionAsset: SetVideoCallAnsweredAsset;

	beforeEach(() => {
		transactionAsset = new SetVideoCallAnsweredAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(17);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('setVideoCallAnswered');
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
