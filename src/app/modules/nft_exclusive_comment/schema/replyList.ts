import { StateSchemaFromType } from 'enevti-types/utils/schema';
import { ExclusiveReplyListChain } from 'enevti-types/chain/nft_exclusive_comment';
import { commentListSchema } from './commentList';

export const replyListSchema: StateSchemaFromType<ExclusiveReplyListChain> = commentListSchema;
