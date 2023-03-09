import { SetVideoCallRejectedAsset } from '../../../../../src/app/modules/redeemable_nft/assets/set_video_call_rejected_asset';

describe('SetVideoCallRejectedAsset', () => {
  // let transactionAsset: SetVideoCallRejectedAsset;

  // beforeEach(() => {
  //   transactionAsset = new SetVideoCallRejectedAsset();
  // });

  // describe('constructor', () => {
  //   it('should have valid id', () => {
  //     expect(transactionAsset.id).toEqual(16);
  //   });

  //   it('should have valid name', () => {
  //     expect(transactionAsset.name).toEqual('setVideoCallRejected');
  //   });

  //   it('should have valid schema', () => {
  //     expect(transactionAsset.schema).toMatchSnapshot();
  //   });
  // });

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
