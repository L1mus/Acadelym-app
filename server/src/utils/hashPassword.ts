import bcrypt from "bcrypt";

const saltRounds : number = 10;

export const generateHash = async (plainPassword :string): Promise<string> => {
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    console.log('Hashed Password:', hash);
    return hash;
}