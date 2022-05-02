/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

export function serializer(data: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(
    JSON.stringify(data, (_, value) => {
      if (Array.isArray(value)) {
        return value.map(item => replacer(item));
      }
      return replacer(value);
    }),
  );
}

function replacer(value: any) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (Buffer.isBuffer(value)) {
    return value.toString('hex');
  }
  return value;
}
