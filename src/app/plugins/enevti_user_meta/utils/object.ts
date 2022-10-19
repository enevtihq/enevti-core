/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const shallowCompare = (
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
): boolean =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(key => obj1[key] === obj2[key]);
