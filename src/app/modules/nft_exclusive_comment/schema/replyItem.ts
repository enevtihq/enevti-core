import { ExclusiveReplyItemChain } from 'enevti-types/chain/nft_exclusive_comment';
import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { commentItemSchema } from './commentItem';

export const replyItemSchema: StateSchemaFromType<ExclusiveReplyItemChain> = commentItemSchema;
