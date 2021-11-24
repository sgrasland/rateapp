import { NextApiRequest, NextApiResponse } from 'next'
import { sign, verify } from 'jsonwebtoken'
import { constants as cst } from '../constants'

const defaultSecret = 'Y(qUD(4jKcOk18(YlJ<Tm52s0O5zO)>O'
export const createToken = (userId: String) => {
    const accessToken = sign(
        { userId: userId },
        process.env.JWT_SECRET || defaultSecret
    )
    return accessToken
}

export const validateToken = function (token: string) {
    if (!token) {
        return null
    } else {
        try {
            const decodedToken = verify(token, process.env.JWT_SECRET || '')
            if (decodedToken) {
                return decodedToken
            } else {
                return null
            }
        } catch {
            return null
        }
    }
}