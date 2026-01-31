import bcrypt from "bcrypt";

const saltRounds : number = 10;

export const generateHash = async (plainPassword :string): Promise<string> => {
    return  await bcrypt.hash(plainPassword, saltRounds);
}

export const checkPasswordHash = async (plainPassword :string , hash : string) =>{
    const result = await bcrypt.compare(plainPassword, hash);
    const logging = result ? "success" : "fail";
    console.log('CheckPassword:', logging);
    return result;
}

