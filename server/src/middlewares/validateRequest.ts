import {AnyZodObject,ZodError} from "zod";
import {Request,Response,NextFunction} from "express";


/*
    ToDo :
    -Buat fungsi validasiRequest dengan parameter schema dari scehema validasi zod yang sudah di definisikan
    dan fungsi validasRequest mengembalikan anonymous fungsi dengan parameter req,res,next
    -lakukan fungsi try
    -Dengan skema Zod apa pun, gunakan .parseAsync(Asyncronus) untuk memvalidasi input. Jika valid,
    Zod akan mengembalikan klon mendalam (deep clone) input yang bertipe kuat (strongly-typed).
    -apa yang di parse yaitu object request.body ,request.query, request.params
    -lalu next()
    -jika gagal catch Error
    -jika errornya turunan dari ZodError
    -buat variable untuk manampung object yang menjelaskan path field mana yang error , dan pesannya apa
    -dengan menggunakan mapping pada parameter error.errors
    -kembalikan res.status(400)
    -di luar fungsi error kembalikan status 500 jika Error lain tidak terduga
 */


export const validationRequest = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            await schema.parseAsync({
                body : req.body,
                query: req.query,
                params : req.params,
            })
            next();
        } catch(error){
            if(error instanceof ZodError){
                const formatedErrors = error.errors.map(error => ({
                    message: error.message,
                    path: error.path[1]
                }))
                console.log(formatedErrors[0].message)
                console.log(formatedErrors[0].path)
                return res.status(400).json({errors: formatedErrors})
            }
        }
        return res.status(500).json({message:"Internal Server Error"})
    }
}