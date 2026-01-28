import {UserTokenEntity} from "../models/userTokens.model.js";


export type createTokenDTO = Omit<UserTokenEntity, 'id' |'created_at'>;
export type updateTokenDTO = Partial<createTokenDTO>;
