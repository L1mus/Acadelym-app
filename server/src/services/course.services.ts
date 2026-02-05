/*
    ToDo
    hitung offset
    query ke database
    query Total
    hitung pagination Meta
 */



import {CourseQueryDTO, CourseSlugDTO} from "../validations/course.validation.js";
import { getAllCourses,getCourseBySlug } from "../repositories/course.repository.js";

export const getAllCoursesService = async (query: CourseQueryDTO) => {
    const result = await getAllCourses(query);
    const rows = result.rows;

    const totalRecords = rows.length > 0 ? parseInt(rows[0].total_records) : 0;

    const toResponseCourseDTO = rows.map((row: any) => {
        const { total_records,...courseData } = row;
        return courseData;
    });

    const totalPages = Math.ceil(totalRecords / query.limit);

    return {
        data: toResponseCourseDTO,
        meta: {
            total_records: totalRecords,
            page: Number(query.page),
            total_pages: totalPages,
            limit: Number(query.limit),
            has_next_page: query.page < totalPages,
            has_prev_page: query.page > 1
        }
    };
};

export const getCourseBySlugService = async (params: CourseSlugDTO) => {
    const result = await getCourseBySlug(params);
    const rows = result.rows;
    console.log(rows);
}

// const getCourseById = async (params: CourseIdDTO) => {}
