import { validateToken } from './jwt-utils'

export function isPasswordComplexEnough(password: String) {
    const minLength = 8
    const upperCase = /[A-Z]/
    const lowerCase = /[a-z]/
    const digit = /\d/
    const special = /\W|_/

    if(password.length < minLength) {
        return false
    }
    let numUpper = 0, numLower = 0, numDigit = 0, numSpecial = 0
    for(let i=0; i<password.length; i++) {
        if(upperCase.test(password[i]))
            numUpper++
        else if(lowerCase.test(password[i]))
            numLower++
        else if(digit.test(password[i]))
            numDigit++
        else if(special.test(password[i]))
            numSpecial++
    }
    if (numUpper === 0 || numLower === 0 || numDigit === 0 || numSpecial === 0) {
        return false
    }  
    return true
}

export const getUserIdFromJwt = function(token: string) {
    const decodedToken = validateToken(token)
    if (decodedToken !== null && !(typeof decodedToken === 'string')) {
        return decodedToken.userId
    } else {
        return null
    }
}
