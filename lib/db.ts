import _, { forEach } from 'lodash';
import mysql from 'serverless-mysql';
import { RowDataPacket } from 'mysql2';

const jwtSecret = process.env.JWT_SECRET
const saltRounds = 10

const db = mysql({  
    config: {    
        host: process.env.MYSQL_HOST,  
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD 
    }
});

export async function excuteSqlQuery(query: string, values: Array<any>) {  
    try {
        const results = await db.query(query, values);
        await db.end();
        return results;
    } catch (error: any) {
        return error.message;
    }
}

export async function getAllUsers() {
    const data = await excuteSqlQuery(`SELECT * FROM rateapp_db.users`, []);
    return JSON.stringify(data)
}

export async function getUserByUsedId(userId: String) {
    const query = 'SELECT * FROM rateapp_db.users WHERE userid=?'
    const values = [userId]
    const data = await excuteSqlQuery(query, values)
    return JSON.stringify(data)
}

export async function getUserByEmail(email: String) {
    const query = 'SELECT * FROM rateapp_db.users WHERE email=?'
    const values = [email]
    const data = await excuteSqlQuery(query, values)
    return JSON.stringify(data)
}

export async function createUser(
    email: String,
    hashedPassword: String,
    firstName: String,
    lastName: String
    ) {
    const query = 'INSERT INTO rateapp_db.users (email, hashedpassword, firstname, lastname) VALUES (?, ?, ?, ?)'
    const values = [email, hashedPassword, firstName, lastName]
    const data = await excuteSqlQuery(query, values)
    return JSON.stringify(data)
}

export interface resultArrayElItf {
    category: string;
    subcategories: string[];
}

export async function getUserCategories(userId: String) {
    const query = 'SELECT DISTINCT category,subcategory FROM rateapp_db.reviews WHERE userid=?'
    const values = [userId]
    try {
        const data = await excuteSqlQuery(query, values)

        // Retrieve distinct categories for user
        const categories = _.uniqBy(data, "category").map((el: any) => el.category)

        // Build result object containing categories and subCategories for user
        const resultArray: resultArrayElItf[] = []
        let resultArrayElement: resultArrayElItf = new Object() as resultArrayElItf
        for (let i=0; i<categories.length; i++) {
            const subCategories = data
                .filter((el: any) => el.category === categories[i])
                .map((el: any) => el.subcategory)
            resultArrayElement = {
                category: categories[i], 
                subcategories: subCategories
            }
            resultArray.push(resultArrayElement)
        }
        return resultArray
    } catch (error: any) {
        return []
    }
}

export interface subCategoryElementItf {
    index: number,
    category: string,
    subcategory: string;
    title: string;
    imagepath: string;
    description: string;
    price: number;
    rating100: number;
    origin: string;
    type: string;
    author: string;
    editor: string;
    location: string;
    cookingtype: string;
    producttype: string;
}

export async function getUserSubCategoryContent(userId: String, subCategory: string | string[] | undefined) {
    const query = 'SELECT * FROM rateapp_db.reviews WHERE userid=? AND subcategory=?'
    const values = [userId, subCategory]
    if (!subCategory || Array.isArray(subCategory)) {
        return []
    }
    try {
        const data = await excuteSqlQuery(query, values)
        let subCategoryElement: subCategoryElementItf = new Object() as subCategoryElementItf
        const resultArray: subCategoryElementItf[] = []
        for (let i=0; i<data.length; i++) {
            subCategoryElement = {
                index: data[i].index,
                category: data[i].category,
                subcategory: data[i].subcategory,
                title: data[i].title,
                imagepath: data[i].imagepath,
                description: data[i].description,
                price: data[i].price,
                rating100: data[i].rating100,
                origin: data[i].origin,
                type: data[i].type,
                author: data[i].author,
                editor: data[i].editor,
                location: data[i].location,
                cookingtype: data[i].cookingtype,
                producttype: data[i].producttype
            }
            resultArray.push(subCategoryElement)
        }
        return resultArray

    } catch (error: any) {
        return []
    }
}

export async function getUserProfilePicturePath(userId: String) {
    const query = 'SELECT profilepicturepath FROM rateapp_db.users WHERE userid=?'
    const values = [userId]
    try {
        const data = await excuteSqlQuery(query, values)
        return data[0].profilepicturepath
    } catch (error: any) {
        return error.message;
    }
}