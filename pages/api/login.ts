import { NextApiRequest, NextApiResponse } from 'next'
import { getUserByEmail } from '../../lib/db'
import { constants as cst } from '../../constants' 
import { buildResponse, getMissingFields } from '../../lib/api-utils'
import { createToken } from '../../lib/jwt-utils'
import { serialize } from 'cookie'
import bcrypt from 'bcrypt'
import {  customLimiter,  runMiddleware } from '../../lib/middleware'

const loginLimiter = customLimiter(60 * 1000, 5)

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {

    // Run middlewares
    try {
        await runMiddleware(req, res, loginLimiter)
    } catch {
        res.status(500)
        res.end(buildResponse(cst.UNKNOWN_ERROR, ''))
        return
    }

    if (req.method === 'POST') {

        const data = req.body

        // Retrieve fields
        const email = data.filter((el: { id: string; value: string }) => el.id === cst.EMAIL)[0].value
        const password = data.filter((el: { id: string; value: string }) => el.id === cst.PASSWORD)[0].value

        // Check that there is no empty required fields
        const missingFields = getMissingFields(data, ['email', 'password'])
        if (missingFields.length !== 0) {
            res.status(403)
            res.end(buildResponse(cst.MISSING_FIELDS, missingFields.map((el: { id: string; value: string }) => el.id)))
            return
        }

        // Get account associated to given email
        let userInfoJson = ''
        try {
            userInfoJson = await getUserByEmail(email)
        } catch (err) {
            res.status(500)
            res.end(buildResponse(cst.UNKNOWN_ERROR, ''))
            return
        }
        const userInfo = JSON.parse(userInfoJson)
        if (JSON.parse(userInfoJson).length === 0) {
            res.status(403)
            res.end(buildResponse(cst.EMAIL_NOT_FOUND, ''))
            return
        }

        // Compare given password to user's hash from database
        const hash = userInfo[0].hashedpassword
        try {
            const isPasswordOK = await bcrypt.compare(password, hash)
            if (!isPasswordOK) {
                res.status(403)
                res.end(buildResponse(cst.INVALID_PASSWORD, ''))
                return
            }
        } catch (err) {
            res.status(500)
            res.end(buildResponse(cst.UNKNOWN_ERROR, ''))
            return
        }
        
        // No error --> Returns JWT in cookie
        const accessToken = createToken(userInfo[0].userid)
        res.setHeader(
            'Set-Cookie',
            serialize(cst.ACCESS_TOKEN, accessToken, { path: '/', maxAge: 1000*60*60*24*30, httpOnly: true })
        )
        res.status(200)
        res.end(buildResponse(cst.NO_ERROR, ''))
    }
}