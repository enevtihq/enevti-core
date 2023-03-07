import { SocialRaffleCollectionRecord } from 'enevti-types/chain/social_raffle';
import { codec } from 'lisk-sdk';
import { collectionRecordSchema } from '../schema/collectionRecord';

export const encodeCollectionRaffledRecord = (
  collectionRecord: SocialRaffleCollectionRecord,
): Buffer => codec.encode(collectionRecordSchema, collectionRecord);

export const decodeCollectionRaffledRecord = (buffer: Buffer): SocialRaffleCollectionRecord =>
  codec.decode<SocialRaffleCollectionRecord>(collectionRecordSchema, buffer);
