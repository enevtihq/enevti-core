import getAllCollection from './collection/getAllCollection';
import getCollectionById from './collection/getCollectionById';
import getCollectionByName from './collection/getCollectionByName';
import getCollectionBySymbol from './collection/getCollectionBySymbol';
import getAllNFT from './nft/getAllNFT';
import getNFTById from './nft/getNFTById';
import getNFTBySerial from './nft/getNFTBySerial';
import getNFTTemplateById from './nft/getNFTTemplateById';
import getAllNFTTemplateGenesis from './nft/getAllNFTTemplateGenesis';
import getAllNFTTemplate from './nft/getAllNFTTemplate';
import getProfile from './profile/getProfile';
import getPersonaByAddress from './persona/getPersonaByAddress';
import getPersonaByUsername from './persona/getPersonaByUsername';
import getStakePoolByAddress from './stake/getStakePoolByAddress';
import getStakePoolByUsername from './stake/getStakePoolByUsername';
import getFeeds from './feeds/getFeeds';
import isNameExists from './registrar/isNameExists';
import isSymbolExists from './registrar/isSymbolExists';
import isSerialExists from './registrar/isSerialExists';
import isUsernameExists from './registrar/isUsernameExists';
import getNodeInfo from './node/getNodeInfo';
import getAssetSchema from './schema/getAssetSchema';

export default {
  getAllCollection,
  getCollectionById,
  getCollectionByName,
  getCollectionBySymbol,
  getAllNFT,
  getNFTById,
  getNFTBySerial,
  getNFTTemplateById,
  getAllNFTTemplateGenesis,
  getAllNFTTemplate,
  getProfile,
  getPersonaByAddress,
  getPersonaByUsername,
  getStakePoolByAddress,
  getStakePoolByUsername,
  getFeeds,
  isNameExists,
  isSymbolExists,
  isSerialExists,
  isUsernameExists,
  getNodeInfo,
  getAssetSchema,
};
