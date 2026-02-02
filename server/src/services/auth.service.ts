import {
    findCountryIdByPhoneNumber,
    duplicateCheck,
    createUser,
    createTokenUser,
    findUserByEmail
} from "../repositories/user.repository.js";
import {AppError} from "../utils/AppError.js";
import {checkPasswordHash, generateHash} from "../utils/authPassword.js";
import {sendVerificationEmail} from "../utils/sendVerificationEmail.js";
import { generateVerificationToken } from "../utils/tokenVerification.js";
import {LoginRequestDTO, UserPayload} from "../validations/auth.validation.js";
import { pool } from "../config/database.js";



/*
    Todo Pseudocode Register
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

export const registerService = async (body: UserPayload) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const token = generateVerificationToken();

        const checkResult = await duplicateCheck(body);
        if ((checkResult.rowCount ?? 0) > 0) {
            throw new AppError(409, "Email or Phone number already registered!");
        }

        const countryResult = await findCountryIdByPhoneNumber(body.phone);
        if (!countryResult.rows[0]) {
            throw new AppError(400, "Invalid country code");
        }

        const countryId = countryResult.rows[0].id;

        const hash: string = await generateHash(body.password);

        const newUserResult = await createUser(body, hash, countryId);
        if (!newUserResult.rows[0]) {
            throw new AppError(500, "Failed to create user");
        }

        const newUser  = newUserResult.rows[0];

        await createTokenUser(newUser.id, token, 'verify_email');

        await client.query('COMMIT');

        await sendVerificationEmail(token, body.email);

        return newUser;

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("SERVICE ERROR:", error);

        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, "Internal Server Error");
    } finally {
        client.release();
    }
}


/*
    Todo Pseudocode Login
    cari user lakukan query ke data base
    jika user kosong/null berhenti dan lempar error "invalid Credential/Email atau password salah"
    cek password bandingkan password yang di input dengan password yang di hash di database
    jika tidak cocok lepar stop error "invalid Credential/Email atau password salah"
    jika seluruhnya benar kirim JWT berisi userid dan role
 */


export const loginService = async (body: LoginRequestDTO) => { // Gunakan Type DTO
    try {
        const userResult = await findUserByEmail(body.email);

        if (userResult.rowCount === 0) {
            throw new AppError(400, "Incorrect email or password");
        }

        const user = userResult.rows[0];

        const isPasswordValid = await checkPasswordHash(body.password, user.password);

        if (!isPasswordValid) {
            throw new AppError(400, "Incorrect email or password");
        }

        if (user.verification_status !== 'verified') {
           throw new AppError(403, "Please verify your email first.");
        }

        return user;

    } catch (error) {
        console.error("SERVICE ERROR:", error);
        if (error instanceof AppError) throw error;
        throw new AppError(500, "Internal Server Error");
    }
}

