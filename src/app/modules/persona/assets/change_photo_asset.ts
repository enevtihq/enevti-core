import { BaseAsset, ApplyAssetContext } from 'lisk-sdk';
import { PersonaAccountProps } from '../../../../types/core/account/persona';
import { ChangePhotoProps } from '../../../../types/core/asset/persona/change_photo_asset';
import { changePhotoAssetSchema } from '../schema/asset/change_photo_asset';

export class ChangePhotoAsset extends BaseAsset<ChangePhotoProps> {
  public name = 'changePhoto';
  public id = 0;

  // Define schema for asset
  public schema = changePhotoAssetSchema;

  public validate(): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<ChangePhotoProps>): Promise<void> {
    const { senderAddress } = transaction;
    const senderAccount = await stateStore.account.get<PersonaAccountProps>(senderAddress);
    senderAccount.persona.photo = asset.photo;
    await stateStore.account.set(senderAddress, senderAccount);
  }
}
