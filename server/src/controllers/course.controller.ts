import {CourseQueryDTO, coursesSchema} from "../validations/course.validation.js";
import {Request,Response,NextFunction} from "express";
import {getAllCoursesService} from "../services/course.services.js";


export const getAllCourses = async (req : Request, res : Response , next : NextFunction)=> {
    try {
        const validationResult = coursesSchema.safeParse({query: req.query});
        if (!validationResult.success) {
            res.status(400).json({
                status: "fail",
                message: "Validation Failed",
                errors: validationResult.error.format(),
            });
            return;
        }

        const courseData: CourseQueryDTO = validationResult.data;
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