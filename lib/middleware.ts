import { NextApiRequest, NextApiResponse } from 'next'
import rateLimit from 'express-rate-limit'

export function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

const keyGeneratorFct = function (req: any) {
    return req.headers["x-forwarded-for"] || req.connection.remoteAddress; 
} // Needed because of issue : https://issueexplorer.com/issue/nfriedly/express-rate-limit/254

export const customLimiter = (windowMs: number, max: number) => {
  return rateLimit({
      keyGenerator: keyGeneratorFct,
      windowMs: windowMs, // nb minutes
      max: max, // nb requests per IP
  });
}
