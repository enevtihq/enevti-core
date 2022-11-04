import * as collection from './collection';
import * as comment from './comment';
import * as commentClubs from './commentClubs';
import * as liked from './liked';
import * as nft from './nft';
import * as reply from './reply';
import * as replyClubs from './replyClubs';

export default {
  ...collection,
  ...comment,
  ...commentClubs,
  ...liked,
  ...nft,
  ...reply,
  ...replyClubs,
};
