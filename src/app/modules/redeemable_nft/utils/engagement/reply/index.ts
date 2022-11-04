import * as clubs from './clubs';
import * as comment from './comment';
import * as commentClubs from './commentClubs';
import * as reply from './reply';

export default {
  ...clubs,
  ...comment,
  ...commentClubs,
  ...reply,
};
