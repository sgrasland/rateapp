import { NextApiRequest, NextApiResponse } from 'next'
import { constants as cst } from '../../../../constants'
import { buildResponse } from '../../../../lib/api-utils'
import { customLimiter, runMiddleware } from '../../../../lib/middleware'
import { getUserIdFromJwt } from '../../../../lib/auth-utils'

const userInfoLimiter = customLimiter(60 * 1000, 30)

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {

    // Run middlewares
    try {
        await runMiddleware(req, res, userInfoLimiter)
    } catch {
        res.status(500)
        res.end(buildResponse(cst.UNKNOWN_ERROR, ''))
        return
    }

    if (req.method === 'GET') {
        const userId = getUserIdFromJwt(req.cookies[cst.ACCESS_TOKEN])
        if (userId !== null) {
            const userCategories = {
                userId: userId,
                categories: ['cheese', 'coffee', 'recipes', 'tea', 'wine', 'beer', 'books', 
                'movies-and-tv-shows', 'video-games', 'museums', 'restaurants', 'shows', 'self-care']
            }
            res.status(200)
            res.end(buildResponse(cst.NO_ERROR, '', userCategories))
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