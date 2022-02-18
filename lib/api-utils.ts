import jwt from 'jsonwebtoken'

let dataFormat: Array<{ id: string; value: string }>

export function getField(data: typeof dataFormat, fieldName: String) {
    return data.filter((el: { id: string; value: string }) => el.id === fieldName)[0].value
}

export function getMissingFields(data: typeof dataFormat, requiredFields: Array<String>) {
    const missingFields = data.filter(
        function (el: { id: string; value: string }) {
            const isRequiredField = requiredFields.indexOf(el.id) !== -1
            const isValueEmpty = el.value.length === 0
            return isRequiredField && isValueEmpty
        })
        return missingFields
}

export function buildResponse(
    errorCode: String, 
    errorValue: String | Array<String>,
    additionnalInfo?: Object ) {
    let responseObject = {
        errorCode: errorCode,
        errorValue: errorValue,
        additionnalInfo: additionnalInfo
    }
    return JSON.stringify(responseObject)
}

export const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json())