import * as sharp from 'sharp';
import * as fs from 'fs';
import { SizeCode } from 'enevti-types/utils/api';

export const widthMap: Record<SizeCode, number> = {
  xxs: 32,
  xs: 64,
  s: 128,
  m: 256,
  l: 512,
  og: 0,
};

export function isValidSize(size: string) {
  return Object.keys(widthMap).includes(size);
}

export function widthMapper(width: number) {
  let ret: string | undefined;
  for (const key of Object.keys(widthMap)) {
    if (widthMap[key] === width) {
      ret = key;
      break;
    }
  }
  return ret;
}

export function sizeMapper(size: SizeCode) {
  return widthMap[size];
}

export function resizeImage(imgBuff: Buffer, size: SizeCode, output: string) {
  let status = true;
  sharp(imgBuff)
    .resize(sizeMapper(size))
    .jpeg({ mozjpeg: true })
    .toBuffer()
    .then(buff => fs.createWriteStream(output).write(buff))
    .catch(() => {
      status = false;
    });
  return status;
}
