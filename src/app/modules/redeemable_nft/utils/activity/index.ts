import * as nft from './nft';
import * as collection from './collection';
import * as engagement from './engagement';
import * as profile from './profile';
import * as moment from './moment';

export const { accessActivityNFT, getActivityNFT, setActivityNFT, addActivityNFT } = nft;

export const {
  accessActivityCollection,
  getActivityCollection,
  setActivityCollection,
  addActivityCollection,
} = collection;

export const {
  accessActivityEngagement,
  getActivityEngagement,
  setActivityEngagement,
  addActivityEngagement,
} = engagement;

export const {
  accessActivityProfile,
  getActivityProfile,
  setActivityProfile,
  addActivityProfile,
} = profile;

export const {
  accessActivityMoment,
  addActivityMoment,
  getActivityMoment,
  setActivityMoment,
} = moment;
