import { BaseChannel } from 'lisk-framework';
import { EnevtiUserMeta } from '../../schema/enevtiUserMetaSchema';

export const invokeGetEnevtiUserMeta = async (
  channel: BaseChannel,
  address: string,
): Promise<EnevtiUserMeta | undefined> => channel.invoke('enevtiUserMeta:getUserMeta', { address });

export const invokeSetEnevtiUserMeta = async (
  channel: BaseChannel,
  publicKey: string,
  meta: string,
  signature: string,
): Promise<void> => channel.invoke('enevtiUserMeta:setUserMeta', { publicKey, meta, signature });
