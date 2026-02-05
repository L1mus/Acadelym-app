import {pool} from "../config/database.js";
import {CourseQueryDTO, CourseSlugDTO} from "../validations/course.validation.js";

export const getAllCourses = (query : CourseQueryDTO) => {
    const offset:number = (query.page - 1) * query.limit;
    const sqlQuery = `SELECT courses.id,
                             courses.slug,
                             courses.title,
                             courses.description,
                             courses.price,
                             courses.thumbnail_url,
                             courses.original_price,
                             users.name AS instructor_name,
                             instructors.job_title AS instructor_job,
                             instructors.company AS instructor_company,
                             COUNT(*) OVER()::int as total_records,
                          COALESCE(AVG(reviews.rating), 0)::float as average_rating,
                          COUNT(reviews.id)::int as total_reviews
                      FROM courses
                               LEFT JOIN reviews ON courses.id = reviews.course_id
                               LEFT JOIN instructors ON courses.instructor_id = instructors.user_id
                               LEFT JOIN users ON instructors.user_id = users.id
                      WHERE
                          ($1::int IS NULL OR courses.category_id = $1)
                        AND
                          ($2::text IS NULL OR courses.title ILIKE '%' || $2 || '%')
                      GROUP BY courses.id,
                               users.name,
                               instructors.job_title,
                               instructors.company
                      ORDER BY
                          CASE WHEN $3 = 'lowest_price' THEN price END ASC,
                          CASE WHEN $3 = 'highest_price' THEN price END DESC,
                          CASE WHEN $3 = 'alphabet_asc' THEN title END ASC,
                          CASE WHEN $3 = 'alphabet_desc' THEN title END DESC,
                          CASE WHEN $3 = 'lowest_rating' THEN AVG(reviews.rating) END ASC,
                          CASE WHEN $3 = 'highest_rating' THEN AVG(reviews.rating) END DESC,
                          courses.created_at DESC
                          LIMIT $4
                      OFFSET $5`;
    const values = [
        query.category_id || null,
        query.search || null,
        query.sort || 'newest',
        query.limit,
        offset
    ];
    return pool.query(sqlQuery, values);
};

export const getCourseBySlug = (params : CourseSlugDTO) => {
    const sqlQuery = `SELECT
                          courses.id,
                          courses.slug,
                          courses.title,
                          courses.description,
                          courses.price,
                          courses.thumbnail_url,
                          courses.original_price,
                          users.name AS instructor_name,
                          instructors.job_title AS instructor_job,
                          instructors.company AS instructor_company,
                          chapters.id,
                          chapters.title,
                          chapters.order_number,
                          lessons.id,
                          lessons.title,
                          lessons.duration,
                          lessons.type
FROM courses
LEFT JOIN instructors ON courses.instructor_id = instructors.user_id
LEFT JOIN users ON instructors.user_id = users.id
LEFT JOIN chapters ON courses.id = chapters.course_id
LEFT JOIN lessons ON chapters.id = lessons.chapter_id

WHERE slug = $1 LIMIT 1`
    const value = [params.slug]
    return pool.query(sqlQuery,value)
}