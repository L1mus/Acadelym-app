export type UserGender = 'pria' | 'wanita';
export type UserRole = 'admin' | 'instructor' | 'student';
export type UserVerificationStatus = 'pending' | 'verified' | 'unverified';

export interface UserEntity{
    id:number;
    name:string;
    email:string;
    password:string;
    gender:UserGender;
    country_id: number;
    phone:string;
    profile_picture_url:string | null;
    created_at:Date;
    role : UserRole | null;
    email_verified_at: Date | null;
    updated_at:Date | null;
    deleted_at: Date | null;
    verification_status : UserVerificationStatus;
}