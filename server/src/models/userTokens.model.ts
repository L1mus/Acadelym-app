export type TypeToken = 'verify_email' | 'reset_password' | 'change_email'

export interface UserTokenEntity {
    id: number;
    user_id: number;
    token: string;
    type : TypeToken;
    expires_at: Date;
    created_at: Date;
}