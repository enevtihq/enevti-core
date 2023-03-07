import { SocialRaffleAddressRecord } from 'enevti-types/chain/social_raffle';
import { codec } from 'lisk-sdk';
import { addressRecordSchema } from '../schema/address';

export const encodeAddressRaffledRecord = (addressRecord: SocialRaffleAddressRecord): Buffer =>
  codec.encode(addressRecordSchema, addressRecord);

export const decodeAddressRaffledRecord = (buffer: Buffer): SocialRaffleAddressRecord =>
  codec.decode<SocialRaffleAddressRecord>(addressRecordSchema, buffer);
