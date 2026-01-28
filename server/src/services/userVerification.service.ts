/*
    Todo pseeudocode
    Url verifikasi di klik oleh client
    cek record dari token yang sudah di kirim apa kah ada ?
    jika tidak kirim Error 404 Request not found atau token sudah di gunakan atau tidak valid
    cek jika url token tersebut sudah kadaluarsa atau belum?
    jika url token tersebut sudah waktu kadaluarsa throw error token tesebut sudah kadaluarsa silahkan kirim ulang dan hapus token yang sudah kadaluarsa
    jika valid update status dan waktu verifikasi pada table user
    dan update juga data pada tabel user token
    seperti delete column token
 */

import {recordUserToken, updateUser, updateUserToken} from "../repositories/user.repository.js";
import {AppError} from "../utils/AppError.js";

export const userVerification = async (id : number, token : string, body : any) =>{
    try {
            const now = new Date()
            const result = await recordUserToken(id)

            if (!result){
                throw new AppError(404, `User not found`);
            }

            const record = result.rows[0];

            if (record.token !== token){
                throw new AppError(404, `Token has been used or is invalid`);
            }

            if (now > record.expires_at){
                await updateUser(id,body,"unverified")
                throw new AppError(401, `Token expired`);
            }

            await updateUserToken(id)
            await updateUser(id,body,"verified")
    }
    catch(error){
        throw new AppError(404, `User verification failed`);
    }
}