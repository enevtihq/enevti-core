/* eslint-disable no-nested-ternary */

export default function createPagination(
  itemLength: number,
  version?: number | string,
  offset?: number | string,
  limit?: number | string,
) {
  const v = version === undefined || Number(version) === 0 ? itemLength : Number(version);
  const o = Number(offset ?? 0) + (itemLength - v);
  const l =
    limit === undefined
      ? itemLength - o
      : Number(limit) + o > itemLength
      ? itemLength
      : Number(limit);
  const c = o + l > itemLength ? itemLength : o + l;
  return { v, o, l, c };
}
