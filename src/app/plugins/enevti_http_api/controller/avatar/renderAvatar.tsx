/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Request, Response } from 'express';
import AccountVisual from './accountVisual';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const svg2img = require('svg2img');

export default () => async (req: Request, res: Response) => {
  try {
    const { wallet } = req.params;
    const height = 250;

    const avatarSVG = ReactDOMServer.renderToStaticMarkup(
      <AccountVisual address={wallet} size={height} />,
    );

    svg2img(avatarSVG, (error, buffer: Buffer) => {
      if (error) throw new Error(error);
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=2592000, public',
        'Last-Modified': 'Mon, 03 Jan 2011 17:45:57 GMT',
        'Content-Length': buffer.length,
      });
      res.end(buffer);
    });
  } catch (err) {
    res.status(409).json({ data: (err as string).toString(), meta: req.params });
  }
};
