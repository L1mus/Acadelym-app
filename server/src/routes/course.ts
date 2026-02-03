import {RequestHandler, Router} from 'express';
import {getAllCourses} from "../controllers/course.controller.js";
import {validationRequest} from "../middlewares/validateRequest.js";
import {courseQuerySchema} from "../validations/course.validation.js";


const router = Router();


router.get('/', validationRequest(courseQuerySchema), getAllCourses as unknown as RequestHandler);
// router.get('/:id', validationRequest(courseIdSchema), getCourseById);//admin/internal
// router.get('/s/:slug', validationRequest(courseSlugSchema), getCourseBySlug); //public/DetailProduct

export default router;