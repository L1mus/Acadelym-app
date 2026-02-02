import {Request,Response,NextFunction} from "express";
import {getAllCoursesService} from "../services/course.services.js";


export const getAllCourses = async (req : Request, res : Response , next : NextFunction)=> {
    try {
        const courseData = req.query;
        const courses = await getAllCoursesService(courseData)
        res.status(200).json({
            success: true,
            message: "Get all courses successfully",
            data: courses
        });
    }
    catch(error){
        console.log(error);
        next(error);
    }
}