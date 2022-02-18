import { NextApiRequest, NextApiResponse } from 'next'
import { getUserIdFromJwt } from '../../../lib/auth-utils'
import { constants as cst } from '../../../constants' 
import { buildResponse } from '../../../lib/api-utils'
import { customLimiter,  runMiddleware } from '../../../lib/middleware'
import { getUserProfilePicturePath } from '../../../lib/db'

const limiter = customLimiter(60 * 1000, 30)

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {

    // Run middlewares
    try {
        await runMiddleware(req, res, limiter)
    } catch {
        res.status(500)
        res.end(buildResponse(cst.UNKNOWN_ERROR, ''))
        return
    }

    if (req.method === 'GET') {
        const userId = getUserIdFromJwt(req.cookies[cst.ACCESS_TOKEN])
        if (userId === null) {
            res.status(403)
            res.end(buildResponse(cst.NEED_RE_AUTHENTICATE, ''))
            return
        } else { // Retrieve user profile picture path
            try {
                const userProfilePicturePath = await getUserProfilePicturePath(userId)
                res.status(200)
                res.end(buildResponse(cst.NO_ERROR, '', userProfilePicturePath))
            } catch {
                res.status(500)
                res.end(buildResponse(cst.UNKNOWN_ERROR, ''))
                return
            }
        }
    }
}