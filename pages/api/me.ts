import { NextApiRequest, NextApiResponse } from 'next'
import { constants as cst } from '../../constants'
import { buildResponse } from '../../lib/api-utils'
import { customLimiter, runMiddleware } from '../../lib/middleware'
import { validateToken } from '../../lib/jwt-utils'

const getUserInfoLimiter = customLimiter(60 * 1000, 30)

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'GET') {
        // Run middlewares
        try {
            await runMiddleware(req, res, getUserInfoLimiter)
        } catch {
            res.status(500)
            res.end(buildResponse(cst.UNKNOWN_ERROR, ''))
            return
        }

        const decodedToken = validateToken(req.cookies[cst.ACCESS_TOKEN])
        if(decodedToken) {
            res.status(200)
            res.end(buildResponse(cst.NO_ERROR, ''))
            return
        } else {
            res.status(403)
            res.end(buildResponse(cst.NEED_RE_AUTHENTICATE, ''))
            return
        }
        
    } else {
        res.status(400)
        res.end(buildResponse(cst.UNKNOWN_QUERY, ''))
    }
}