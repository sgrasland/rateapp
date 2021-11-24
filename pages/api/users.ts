import { NextApiRequest, NextApiResponse } from 'next'
import { getUserByEmail, createUser } from '../../lib/db'
import { constants as cst } from '../../constants'
import { buildResponse, getField, getMissingFields } from '../../lib/api-utils'
import { isPasswordComplexEnough } from '../../lib/auth-utils'
import bcrypt from 'bcrypt'
import { customLimiter, runMiddleware } from '../../lib/middleware'
import { createToken } from '../../lib/jwt-utils'
import { serialize } from 'cookie'

const usersLimiter = customLimiter(60 * 1000, 5)

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {

    // Run middlewares
    try {
        await runMiddleware(req, res, usersLimiter)
    } catch {
        res.status(500)
        res.end(buildResponse(cst.UNKNOWN_ERROR, ''))
        return
    }

    if (req.method === 'POST') {

        const data = req.body

        // Retrieve fields
        const email = getField(data, cst.EMAIL)
        const firstname = getField(data, cst.FIRST_NAME)
        const lastname = getField(data, cst.LAST_NAME)
        const password = getField(data, cst.PASSWORD)
        const confirmPassword = getField(data, cst.CONFIRM_PASSWORD)

        // Check that there is no empty required fields
        const missingFields = getMissingFields(data, ['email', 'firstname', 'lastname', 'password', 'confirmpassword'])
        if (missingFields.length !== 0) {
            res.status(403)
            res.end(buildResponse(cst.MISSING_FIELDS, missingFields.map((el: { id: string; value: string }) => el.id)))
            return
        }

        // Check if an account already exists with given email
        try {
            const userInfoJson = await getUserByEmail(email)
            const userInfo = JSON.parse(userInfoJson)
            if (userInfo.length !== 0) {
                res.status(403)
                res.end(buildResponse(cst.EMAIL_ALREADY_EXISTS, ''))
                return
            }
        } catch {
            res.status(500)
            res.end(buildResponse(cst.UNKNOWN_ERROR, ''))
            return
        }

        // Check if passwords are matching
        if (password !== confirmPassword) {
            res.status(403)
            res.end(buildResponse(cst.PASSWORDS_NOT_MATCHING, ''))
            return
        }

        // Check password complexity
        if (!isPasswordComplexEnough(password)) {
            res.status(403)
            res.end(buildResponse(cst.PASSWORDS_NOT_COMPLEX_ENOUGH, ''))
            return
        }

        // Salt and hash password (saltRounds = 10), then create user
        try {
            const hash = await bcrypt.hash(password, 10)
            await createUser(email, hash, firstname, lastname)
        } catch {
            res.status(500)
            res.end(buildResponse(cst.UNKNOWN_ERROR, ''))
            return
        }

        // Retrieve created user info
        try {
            const userInfoJson = await getUserByEmail(email)
            const userInfo = JSON.parse(userInfoJson)
            // Returns JWT in cookie
            const accessToken = createToken(userInfo[0].userid)
            res.setHeader(
                'Set-Cookie',
                serialize(cst.ACCESS_TOKEN, accessToken, { path: '/', maxAge: 1000*60*60*24*30, httpOnly: true })
            )
            res.status(200)
        res.end(buildResponse(cst.NO_ERROR, ''))
        } catch (err) {
            res.status(500)
            res.end(buildResponse(cst.UNKNOWN_ERROR, ''))
            return
        }
    } else {
        res.status(400)
        res.end(buildResponse(cst.UNKNOWN_QUERY, ''))
    }
}