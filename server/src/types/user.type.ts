import {UserEntity} from "../models/users.model.js";

// DTO (Data Trasnfer Object)
export type CreateUserDTO = Omit<UserEntity, 'id' |'country_id' |'profile_picture_url' | 'created_at' | 'updated_at' | 'deleted_at' |'role' |'email_verified_at'>;
export type UpdateUserDTO =  Partial<CreateUserDTO>;

export type DuplicateUserDTO = Pick<UserEntity, 'email' | 'phone'>;

export type ResponseUserDTO = Omit<UserEntity, 'id"'| 'password' | 'created_at' | 'updated_at' | 'deleted_at' |'role'| 'email_verified_at'>;

