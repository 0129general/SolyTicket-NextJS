import { NextApiRequest, NextApiResponse } from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const proxy = createProxyMiddleware({
  target: 'http://backend-service:3500/', // Note the trailing slash
  changeOrigin: true,
  pathRewrite: { '^/api/v1': '/v1' },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // @ts-ignore
  return proxy(req, res);
}