import getActivityCollection from './activity/getActivityCollection';
import getActivityNFT from './activity/getActivityNFT';
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
import getProfileNonce from './profile/getProfileNonce';
import getProfilePendingDelivery from './profile/getProfilePendingDelivery';
import getPersonaByAddress from './persona/getPersonaByAddress';
import getPersonaByUsername from './persona/getPersonaByUsername';
import getStakePoolByAddress from './stake/getStakePoolByAddress';
import getStakePoolByUsername from './stake/getStakePoolByUsername';
import getFeeds from './feeds/getFeeds';
import getAvailableFeeds from './feeds/getAvailableFeeds';
import isNameExists from './registrar/isNameExists';
import isSymbolExists from './registrar/isSymbolExists';
import isSerialExists from './registrar/isSerialExists';
import isUsernameExists from './registrar/isUsernameExists';
import nameToCollection from './registrar/nameToCollection';
import symbolToCollection from './registrar/symbolToCollection';
import serialToNFT from './registrar/serialToNFT';
import usernameToAddress from './registrar/usernameToAddress';
import getTransactionFee from './transaction/getTransactionFee';
import getTransactionBaseFee from './transaction/getTransactionBaseFee';
import getTransactionDynamicBaseFee from './transaction/getTransactionDynamicBaseFee';
import postTransaction from './transaction/postTransaction';

export default {
  getActivityCollection,
  getActivityNFT,
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
  getProfileNonce,
  getProfilePendingDelivery,
  getPersonaByAddress,
  getPersonaByUsername,
  getStakePoolByAddress,
  getStakePoolByUsername,
  getFeeds,
  getAvailableFeeds,
  isNameExists,
  isSymbolExists,
  isSerialExists,
  isUsernameExists,
  nameToCollection,
  symbolToCollection,
  serialToNFT,
  usernameToAddress,
  getTransactionFee,
  getTransactionBaseFee,
  getTransactionDynamicBaseFee,
  postTransaction,
};
