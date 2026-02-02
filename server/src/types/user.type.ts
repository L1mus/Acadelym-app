import {UserEntity} from "../models/users.model.js";

// DTO (Data Trasnfer Object)
export type CreateUserDTO = Pick<UserEntity, 'name'|'email'|'password'|'gender'|'phone'>

export type UpdateUserDTO =  Partial<CreateUserDTO>;

export type DuplicateUserDTO = Pick<UserEntity, 'email' | 'phone'>;

export type ResponseUserDTO = Pick<UserEntity, 'name' |'email' | 'phone' | 'gender'>;

