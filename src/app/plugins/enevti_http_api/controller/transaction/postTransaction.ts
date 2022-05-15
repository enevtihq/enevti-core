import { Request, Response } from 'express';
import { BaseChannel, PluginCodec, TransactionJSON } from 'lisk-framework';
import { cryptography, transactions } from 'lisk-sdk';
import { invokeGetNodeIndo, invokePostTransaction } from '../../utils/hook/app';
import { getAssetSchema } from '../../utils/schema/getAssetSchema';
import transformAsset from './transformer';

export default (channel: BaseChannel, codec: PluginCodec) => async (
  req: Request,
  res: Response,
) => {
  try {
    const { payload } = req.body as { payload: Record<string, unknown> };
    if (payload.moduleID === undefined || payload.assetID === undefined) {
      throw new Error('invalid transaction payload');
    }
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error('Not authorized');
    }
    const passphrase = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':')[1];

    const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(passphrase);
    const nodeInfo = await invokeGetNodeIndo(channel);

    const schema = await getAssetSchema(
      channel,
      payload.moduleID as number,
      payload.assetID as number,
    );

    const { id, ...tx } = transactions.signTransaction(
      schema,
      {
        ...transformAsset(payload),
        fee: BigInt(payload.fee as string),
        nonce: BigInt(payload.nonce as string),
        senderPublicKey: publicKey,
      },
      Buffer.from(nodeInfo.networkIdentifier as string, 'hex'),
      passphrase,
    );
    const encodedTransaction = codec.encodeTransaction((tx as unknown) as TransactionJSON);
    const result = await invokePostTransaction(channel, encodedTransaction);

    res.status(200).json({ data: result, meta: req.body as { payload: Record<string, unknown> } });
  } catch (err: unknown) {
    res.status(409).json({
      data: (err as string).toString(),
      meta: req.body as { payload: Record<string, unknown> },
    });
  }
};
