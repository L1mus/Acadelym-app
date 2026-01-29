import {pool} from "../config/database.js";
import {UserEntity, UserVerificationStatus} from "../models/users.model.js";
import {CreateUserDTO, DuplicateUserDTO, UpdateUserDTO} from "../types/user.type.js";
import {TypeToken, UserTokenEntity} from "../models/userTokens.model.js";


export const findCountryIdByPhoneNumber = async (fullPhoneNumber: string) => {
    const sqlQuery = `
        SELECT id, phone_code
        FROM countries
        WHERE $1 LIKE phone_code || '%'
        ORDER BY LENGTH(phone_code) DESC
            LIMIT 1;
    `;
    const values = [fullPhoneNumber];
    return pool.query(sqlQuery, values);
}

export const createUser = ( body:CreateUserDTO , hashPassword : string, countryId : number) => {
    const sqlQuery = `
        INSERT INTO users (name, email, password, gender, phone,country_id)
        VALUES ($1, $2, $3, $4, $5,$6)
            RETURNING *;
    `;
    const values = [body.name, body.email, hashPassword, body.gender, body.phone, countryId];
    return pool.query<UserEntity>(sqlQuery,values);
}

export const updateUser = (id: number, body : UpdateUserDTO, verificationStatus : UserVerificationStatus) =>{
    const sqlQuery = `
        UPDATE users
        SET name = COALESCE($1, name),
            email = COALESCE($2, email),
            password = COALESCE($3, address),
            gender = COALESCE($4, gender),
            phone = COALESCE($5, password),
            verification_status = COALESCE($6, verification_status)
        WHERE id = $7
            RETURNING *;
    `;
    const values = [body.name, body.email, body.password, body.gender, body.phone, verificationStatus, id];
    return pool.query<UserEntity>(sqlQuery, values);
}

export const duplicateCheck = async (body:DuplicateUserDTO) => {
    const sqlQuery = `SELECT 1 FROM users WHERE email = $1 or phone = $2 LIMIT 1;`;
    const values = [body.email, body.phone];
    return pool.query<UserEntity>(sqlQuery,values);
}

export const  createTokenUser = async (userId : number, token : string , type : TypeToken) => {
    const sqlQuery = `INSERT INTO user_tokens (user_id, token, type, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '1 hours')`
    const values = [userId, token, type];
    return pool.query<UserTokenEntity>(sqlQuery,values);
}

export const recordUserToken = async (id : number) => {
    const sqlQuery = `SELECT token, expires_at FROM user_tokens WHERE id = $1 LIMIT 1`;
    const values = [id];
    return pool.query<UserTokenEntity>(sqlQuery,values);
}

export const updateUserToken = async (id : number) =>{
    const sqlQuery = `UPDATE user_tokens
                      SET
                          token = NULL,
                          expires_at = NULL
                      WHERE id = $1;`;
    const values = [id];
    return pool.query<UserTokenEntity>(sqlQuery,values);
}
