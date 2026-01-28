import {duplicateCheck,createUser,createTokenUser} from "../repositories/user.repository.js";
import {AppError} from "../utils/AppError.js";
import {generateHash} from "../utils/hashPassword.js";
import {sendVerificationEmail} from "../utils/sendVerificationEmail.js";
import { generateVerificationToken } from "../utils/tokenVerification.js";


/*
    Todo Pseudocode
     ->cek duplikasi database
     jika data di temukan lempar error , email atau no.hanphone sudah terdaftar
     ->lakukan hashing pada password menggunalakan library bcrypt
     ambil password user, lalu enkripsi dengana sal rounds 10
     result buat string acak
     -> lakukan verifikasi email
     buat generate token verifikasi email
     tentukan kadaluarsa token
     -> simpan kedatabase
     lalu set status akun menjadi Pending atau is_verified = false
     -> kirim email (sideEffect)
     gunakan layanan email  seperti Nodemailer/resend
     buat content kirim link ke email user: https://aplikasiku.com/verify_email={token_tadi}
 */

export const registerService = async (body: any) => {
    try {
        const token = generateVerificationToken();

        const checkResult = await duplicateCheck(body);
        if ((checkResult.rowCount ?? 0) > 0) {
            throw new AppError(409, "Email or Phone number already registered!");
        }

        const hash: string = await generateHash(body.password);
        const newUserResult = await createUser(body, hash);

        if (!newUserResult.rows[0]) {
            throw new AppError(500, "Failed to create user");
        }

        const newUser = newUserResult.rows[0];

        await createTokenUser(newUser.id, token, 'verify_email');

        await sendVerificationEmail(token, body.email);

        return newUser;

    } catch (error) {
        console.error("SERVICE ERROR:", error);

        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, "Internal Server Error");
    }
}

