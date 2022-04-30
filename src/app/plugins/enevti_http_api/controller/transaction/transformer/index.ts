function registerDelegate(payload: Record<string, unknown>) {
  return payload;
}

function voteDelegate(payload: Record<string, unknown>) {
  return {
    ...payload,
    asset: {
      votes: ((payload.asset as { votes: unknown }).votes as {
        delegateAddress: string;
        amount: string;
      }[]).map(item => ({
        delegateAddress: Buffer.from(item.delegateAddress, 'hex'),
        amount: BigInt(item.amount),
      })),
    },
  };
}

export default function transformAsset(payload: Record<string, unknown>) {
  switch (payload.moduleID) {
    case 5:
      switch (payload.assetID) {
        case 0:
          return registerDelegate(payload);
        case 1:
          return voteDelegate(payload);
        default:
          return payload;
      }
    default:
      return payload;
  }
}
