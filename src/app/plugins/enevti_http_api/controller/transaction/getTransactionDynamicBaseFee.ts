import { Request, Response } from 'express';
import { BaseChannel } from 'lisk-framework';
import { cryptography, transactions } from 'lisk-sdk';
import { invokeGetNodeIndo } from '../../utils/hook/app';
import { invokeGetDynamicBaseFeePerByte } from '../../utils/hook/dynamic_base_fee_module';
import { invokeGetAccount } from '../../utils/hook/persona_module';
import { getAssetSchema } from '../../utils/schema/getAssetSchema';
import transformAsset from './transformer';

export default (channel: BaseChannel) => async (req: Request, res: Response) => {
  try {
    const { payload } = req.body as { payload: Record<string, unknown> };
    if (
      payload.moduleID === undefined ||
      payload.assetID === undefined ||
      payload.fee === undefined
    ) {
      throw new Error('invalid transaction payload');
    }
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error('Not authorized');
    }
    const passphrase = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':')[1];

    const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(passphrase);
    const address = cryptography.getAddressFromPassphrase(passphrase);
    const account = await invokeGetAccount(channel, address.toString('hex'));
    const nodeInfo = await invokeGetNodeIndo(channel);
    const schema = await getAssetSchema(
      channel,
      payload.moduleID as number,
      payload.assetID as number,
    );

    const tx = transactions.signTransaction(
      schema,
      {
        ...transformAsset(payload),
        fee: BigInt(payload.fee as string),
        nonce: BigInt(account.sequence.nonce),
        senderPublicKey: publicKey,
      },
      Buffer.from(nodeInfo.networkIdentifier as string, 'hex'),
      passphrase,
    );
    const minFeePerByte = await invokeGetDynamicBaseFeePerByte(
      channel,
      tx as { moduleID: number; assetID: number },
    );

    const minFee = BigInt(minFeePerByte) * BigInt(transactions.getBytes(schema, tx).length);

    res
      .status(200)
      .json({ data: minFee.toString(), meta: req.body as { payload: Record<string, unknown> } });
  } catch (err: unknown) {
    res.status(409).json({
      data: (err as string).toString(),
      meta: req.body as { payload: Record<string, unknown> },
    });
  }
};
