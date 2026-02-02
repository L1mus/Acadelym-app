/*
    ToDo
    hitung offset
    query ke database
    query Total
    hitung pagination Meta
 */



import { CourseQueryDTO } from "../validations/course.validation.js";
import { getAllCourses } from "../repositories/course.repository.js";

export const getAllCoursesService = async (params: CourseQueryDTO) => {
    const result = await getAllCourses(params);
    const rows = result.rows;

    const totalRecords = rows.length > 0 ? rows[0].total_records : 0;

    const toResponseCourseDTO = rows.map((row: any) => {
        const { total_records, ...courseData } = row;
        return courseData;
    });

    const totalPages = Math.ceil(totalRecords / params.limit);

    return {
        data: toResponseCourseDTO,
        meta: {
            total_records: totalRecords,
            page: params.page,
            total_pages: totalPages,
            limit: params.limit,
            has_next_page: params.page < totalPages,
            has_prev_page: params.page > 1
        }
    };
};

