import {
  SocialRaffleBlockRecord,
  SocialRaffleChain,
  SocialRaffleCollectionChain,
} from 'enevti-types/chain/social_raffle';
import { GetCollectionRaffleConfig, GetRecordParam } from 'enevti-types/param/social_raffle';
import { BaseChannel, GenesisConfig } from 'lisk-framework';

/**
 * get social_raffle genesis config
 *
 * @example <caption>Get raffle config</caption>
 * await invokeGetRaffleConfig(channel);
 *
 * @param channel plugin channel from Lisk SDK
 * @returns GenesisConfig
 */
export const invokeGetRaffleConfig = async (channel: BaseChannel): Promise<GenesisConfig> =>
  channel.invoke('socialRaffle:getConfig');

/**
 * get collection raffle config, whether raffle is enabled for specified collection or not
 *
 * @example <caption>Get whether raffle is enabled for collection '9cabee3d27426676b852ce6b804cb2fdff7cd0b5'</caption>
 * const collectionId = Buffer.from('9cabee3d27426676b852ce6b804cb2fdff7cd0b5', 'hex');
 * await invokeGetCollectionRaffleConfig(channel, collectionId);
 *
 * @param channel plugin channel from Lisk SDK
 * @param id collectionId in bytes
 * @returns SocialRaffleCollectionChain | undefined
 */
export const invokeGetCollectionRaffleConfig = async (
  channel: BaseChannel,
  id: Buffer,
): Promise<SocialRaffleCollectionChain | undefined> =>
  channel.invoke('socialRaffle:getCollectionRaffleConfig', { id } as GetCollectionRaffleConfig);

/**
 * get social raffle chain state
 *
 * @example <caption>Get raffle state</caption>
 * await invokeGetRaffleState(channel);
 *
 * @param channel plugin channel from Lisk SDK
 * @returns SocialRaffleChain
 */
export const invokeGetRaffleState = async (channel: BaseChannel): Promise<SocialRaffleChain> =>
  channel.invoke('socialRaffle:getState');

/**
 * get raffle history on specified block height
 *
 * @example <caption>Get raffle history for block 99</caption>
 * await invokeGetRaffleBlockRecord(channel, 99);
 *
 * @param channel plugin channel from Lisk SDK
 * @param height block height
 * @returns SocialRaffleBlockRecord
 */
export const invokeGetRaffleBlockRecord = async (
  channel: BaseChannel,
  height: number,
): Promise<SocialRaffleBlockRecord> =>
  channel.invoke('socialRaffle:getRecord', { height } as GetRecordParam);
