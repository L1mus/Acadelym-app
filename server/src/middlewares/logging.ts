import type {Request,Response,NextFunction} from "express";

export const logRequest = (req: Request, _res: Response, next : NextFunction) => {
    console.log("Accessing API Path", req.path);
    next()
}