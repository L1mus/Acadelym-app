import z from 'zod';

export const userCoreSchema =
    z.object({
        name: z
            .string()
            .min(1,{message: 'Name is required'}),
        email : z
            .string()
            .email({ message : "Invalid Email Format" })
            .min(1, {message : "Email is required"})
            .max(56, {message : "Email is too long"})
            .trim()
            .toLowerCase(),
        password: z
            .string()
            .min(8, {message : "Password must be at least 8 characters"})
            .max(64, {message : "Password Maximum 64 characters"})
            .regex(/[A-Z]/, {message : "Passwords must contain at least one uppercase letter."})
            .regex(/[0-9]/, {message : "Passwords must contain at least 1 number"}),
        gender: z
            .enum(['pria', 'wanita'],{message : "Gender is required"}),
        phone: z
            .string()
            .min(10, {message : "Phone number must be at least 10 numbers"})
            .max(14, {message : "Phone number Maximum 14 numbers"})
            .regex(/^\+?[1-9]\d{10,14}$/, {message : "Invalid Phone numbers Format"}),
    })

export const registerSchema = z.object({
    body: userCoreSchema,
});

export type RegisterRequestDTO = z.infer<typeof registerSchema>;
export type UserPayload = z.infer<typeof userCoreSchema>;