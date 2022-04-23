import { BaseAsset, ApplyAssetContext } from 'lisk-sdk';
import { PersonaAccountProps } from '../../../../types/core/account/persona';
import { ChangeTwitterProps } from '../../../../types/core/asset/persona/change_twitter_asset';
import { changeTwitterAssetSchema } from '../schema/asset/change_twitter_asset';

export class ChangeTwitterAsset extends BaseAsset {
  public name = 'changeTwitter';
  public id = 1;

  // Define schema for asset
  public schema = changeTwitterAssetSchema;

  public validate(): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({
    asset,
    transaction,
    stateStore,
  }: ApplyAssetContext<ChangeTwitterProps>): Promise<void> {
    const { senderAddress } = transaction;
    const senderAccount = await stateStore.account.get<PersonaAccountProps>(senderAddress);
    senderAccount.persona.social.twitter = asset.twitter;
    await stateStore.account.set(senderAddress, senderAccount);
  }
}
