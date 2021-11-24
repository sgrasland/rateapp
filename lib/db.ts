import mysql from 'serverless-mysql';
import bcrypt from 'bcrypt'
import uuid from 'uuid'
import jwt from 'jsonwebtoken'

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