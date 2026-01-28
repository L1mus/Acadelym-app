import {duplicateCheck,createUser,createTokenUser} from "../repositories/user.repository.js";
import {AppError} from "../utils/AppError.js";
import {generateHash} from "../utils/hashPassword.js";
import {sendVerificationEmail} from "../utils/sendVerificationEmail.js";
import {tokenVerification} from "../utils/tokenVerification.js";


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

export const registerService = async (body : any) => {
    try {
        const token = tokenVerification
        const isDuplicate = await duplicateCheck(body);
        console.log(isDuplicate);
        if (isDuplicate) {
            throw new AppError(401, "User already exists!");
        }
        const hash : string = await generateHash(body.password);
        await createUser(body,hash);
        await createTokenUser(body.id,token,'verify_email');
        await sendVerificationEmail(token,body.email);
    }
    catch (error) {
        throw new AppError(500, "Internal Server Error");
    }

}

