import { codec, StateStore, BaseModuleDataAccess } from 'lisk-sdk';
import {
  CHAIN_STATE_ALL_NFT_TEMPLATE,
  CHAIN_STATE_NFT_TEMPLATE,
  GENESIS_STATE_ALL_NFT_TEMPLATE,
} from '../constants/codec';
import { allNFTTemplateSchema, nftTemplateSchema } from '../schemas/chain/nft_template';
import { AllNFTTemplate, NFTTemplateAsset } from '../../../../types/core/chain/nft/NFTTemplate';
import { createPagination } from './transaction';

export const accessAllNFTTemplateGenesis = async (
  dataAccess: BaseModuleDataAccess,
  offset = 0,
  limit?: number,
): Promise<AllNFTTemplate> => {
  const registeredTemplateBuffer = await dataAccess.getChainState(GENESIS_STATE_ALL_NFT_TEMPLATE);
  if (!registeredTemplateBuffer) {
    return { items: [] };
  }
  const allNftTemplate = codec.decode<AllNFTTemplate>(
    allNFTTemplateSchema,
    registeredTemplateBuffer,
  );
  const { l } = createPagination(allNftTemplate.items.length, undefined, offset, limit);
  allNftTemplate.items.slice(offset, offset + l);
  return allNftTemplate;
};

export const getAllNFTTemplateGenesis = async (
  stateStore: StateStore,
  offset = 0,
  limit?: number,
): Promise<AllNFTTemplate> => {
  const registeredTemplateBuffer = await stateStore.chain.get(GENESIS_STATE_ALL_NFT_TEMPLATE);
  if (!registeredTemplateBuffer) {
    return { items: [] };
  }
  const allNftTemplate = codec.decode<AllNFTTemplate>(
    allNFTTemplateSchema,
    registeredTemplateBuffer,
  );
  const { l } = createPagination(allNftTemplate.items.length, undefined, offset, limit);
  allNftTemplate.items.slice(offset, offset + l);
  return allNftTemplate;
};

export const setAllNFTTemplateGenesis = async (
  stateStore: StateStore,
  allNFTTemplate: AllNFTTemplate,
) => {
  await stateStore.chain.set(
    GENESIS_STATE_ALL_NFT_TEMPLATE,
    codec.encode(allNFTTemplateSchema, allNFTTemplate),
  );
};

export const accessAllNFTTemplate = async (
  dataAccess: BaseModuleDataAccess,
  offset = 0,
  limit?: number,
): Promise<AllNFTTemplate> => {
  const registeredTemplateBuffer = await dataAccess.getChainState(CHAIN_STATE_ALL_NFT_TEMPLATE);
  if (!registeredTemplateBuffer) {
    return { items: [] };
  }
  const allNftTemplate = codec.decode<AllNFTTemplate>(
    allNFTTemplateSchema,
    registeredTemplateBuffer,
  );
  const { l } = createPagination(allNftTemplate.items.length, undefined, offset, limit);
  allNftTemplate.items.slice(offset, offset + l);
  return allNftTemplate;
};

export const getAllNFTTemplate = async (
  stateStore: StateStore,
  offset = 0,
  limit?: number,
): Promise<AllNFTTemplate> => {
  const registeredTemplateBuffer = await stateStore.chain.get(CHAIN_STATE_ALL_NFT_TEMPLATE);
  if (!registeredTemplateBuffer) {
    return { items: [] };
  }
  const allNftTemplate = codec.decode<AllNFTTemplate>(
    allNFTTemplateSchema,
    registeredTemplateBuffer,
  );
  const { l } = createPagination(allNftTemplate.items.length, undefined, offset, limit);
  allNftTemplate.items.slice(offset, offset + l);
  return allNftTemplate;
};

export const setAllNFTTemplate = async (stateStore: StateStore, allNFTTemplate: AllNFTTemplate) => {
  await stateStore.chain.set(
    CHAIN_STATE_ALL_NFT_TEMPLATE,
    codec.encode(allNFTTemplateSchema, allNFTTemplate),
  );
};

export const accessNFTTemplateById = async (
  dataAccess: BaseModuleDataAccess,
  id: string,
): Promise<NFTTemplateAsset | undefined> => {
  const templateBuffer = await dataAccess.getChainState(`${CHAIN_STATE_NFT_TEMPLATE}:${id}`);
  if (!templateBuffer) {
    return undefined;
  }
  return codec.decode<NFTTemplateAsset>(nftTemplateSchema, templateBuffer);
};

export const getNFTTemplateById = async (
  stateStore: StateStore,
  id: string,
): Promise<NFTTemplateAsset | undefined> => {
  const templateBuffer = await stateStore.chain.get(`${CHAIN_STATE_NFT_TEMPLATE}:${id}`);
  if (!templateBuffer) {
    return undefined;
  }
  return codec.decode<NFTTemplateAsset>(nftTemplateSchema, templateBuffer);
};

export const setNFTTemplateById = async (
  stateStore: StateStore,
  id: string,
  template: NFTTemplateAsset,
) => {
  await stateStore.chain.set(
    `${CHAIN_STATE_NFT_TEMPLATE}:${id}`,
    codec.encode(nftTemplateSchema, template),
  );
};

export const addNFTTemplate = async (stateStore: StateStore, template: NFTTemplateAsset) => {
  const templateById = await getNFTTemplateById(stateStore, template.id);
  if (templateById) {
    throw new Error('template already exist');
  }

  const allTemplateName = await getAllNFTTemplate(stateStore);
  allTemplateName.items.push(template.id);
  await setAllNFTTemplate(stateStore, allTemplateName);
  await setNFTTemplateById(stateStore, template.id, template);
};

export const addNFTTemplateGenesis = async (stateStore: StateStore, template: NFTTemplateAsset) => {
  const templateById = await getNFTTemplateById(stateStore, template.id);
  if (templateById) {
    throw new Error('template already exist');
  }

  const allTemplateName = await getAllNFTTemplateGenesis(stateStore);
  allTemplateName.items.push(template.id);
  await setAllNFTTemplateGenesis(stateStore, allTemplateName);
  await setNFTTemplateById(stateStore, template.id, template);
};
