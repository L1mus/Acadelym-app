import {Request,Response,NextFunction} from "express";
import {getAllCoursesService, getCourseBySlugService} from "../services/course.services.js";
import {CourseQueryDTO, CourseSlugDTO} from "../validations/course.validation.js";


export const getAllCourses = async (req : Request<unknown,unknown,unknown,CourseQueryDTO>, res : Response , next : NextFunction)=> {
    try {
        const courseData = req.query;
        console.log(typeof courseData);
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

export const getCourseBySlug = async (req:Request<CourseSlugDTO,unknown,unknown,unknown>,res:Response,next : NextFunction) => {
    try {
        const courseDataBySlug = req.params;
        const detailCourse = await getCourseBySlugService(courseDataBySlug)
        res.status(200).json({
            success: true,
            message: "Get course successfully",
            data: detailCourse
        })
    }
    catch(error){
        console.log(error);
        next(error);
    }
}