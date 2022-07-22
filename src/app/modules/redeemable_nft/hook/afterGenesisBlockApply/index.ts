import { AfterGenesisBlockApplyContext } from 'lisk-framework';
import { BlankNFTTemplate, EnevtiNFTTemplate } from '../../config/template';
import { addNFTTemplateGenesis } from '../../utils/nft_template';

export default async function redeemableNftAfterGenesisBlockApply(
  input: AfterGenesisBlockApplyContext,
) {
  await addNFTTemplateGenesis(input.stateStore, EnevtiNFTTemplate);
  await addNFTTemplateGenesis(input.stateStore, BlankNFTTemplate);
}
