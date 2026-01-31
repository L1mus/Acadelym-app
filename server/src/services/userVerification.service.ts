/*
    Todo pseeudocode
    Url verifikasi di klik oleh client
    client di arahkan membuka halaman baru di bagian frondend
    frontend akan mengirim query berupa token
    menerima request query dari client
    cari user berdasarkan token tersebut
    validasi
    cek record dari token yang sudah di kirim apa kah ada ?
    jika tidak kirim Error 404 Request not found atau token sudah di gunakan atau tidak valid
    cek jika url token tersebut sudah kadaluarsa atau belum?
    jika url token tersebut sudah waktu kadaluarsa throw error token tesebut sudah kadaluarsa silahkan kirim ulang dan hapus token yang sudah kadaluarsa
    jika valid update status dan waktu verifikasi pada table user
    dan update juga data pada tabel user token
    seperti delete column token
 */

import { findTokenByValue, updateUser, deleteToken } from "../repositories/user.repository.js";
import { AppError } from "../utils/AppError.js";

export const verifyEmailService = async (token: string) => {
    try {
        const tokenResult = await findTokenByValue(token);

        if (tokenResult.rowCount === 0) {
            throw new AppError(400, "Invalid or expired verification token");
        }

        const tokenRecord = tokenResult.rows[0];
        const now = new Date();

        if (now > new Date(tokenRecord.expires_at)) {
            await deleteToken(tokenRecord.id);
            throw new AppError(400, "Token expired, please request a new one");
        }

        await updateUser(tokenRecord.user_id, {} as any, "verified");

        await deleteToken(tokenRecord.id);

        return { message: "Email verified successfully" };

    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(500, "Verification process failed");
    }
}