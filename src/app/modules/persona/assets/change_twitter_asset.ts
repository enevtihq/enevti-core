import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { PersonaAccountProps } from 'enevti-types/account/persona';
import { ChangeTwitterProps } from 'enevti-types/asset/persona/change_twitter_asset';
import { VALIDATION } from '../constant/validation';
import { changeTwitterAssetSchema } from '../schema/asset/change_twitter_asset';

export class ChangeTwitterAsset extends BaseAsset {
  public name = 'changeTwitter';
  public id = 1;

  // Define schema for asset
  public schema = changeTwitterAssetSchema;

  public validate({ asset }: ValidateAssetContext<ChangeTwitterProps>): void {
    if (asset.twitter.length > VALIDATION.TWITTER_ID_MAXLENGTH) {
      throw new Error(`asset.twitter max length is ${VALIDATION.TWITTER_ID_MAXLENGTH}`);
    }
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
