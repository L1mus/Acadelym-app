import {pool} from "../config/database.js";
import {CourseQueryDTO} from "../validations/course.validation.js";

export const getAllCourses = (params : CourseQueryDTO) => {
    const offset:number = (params.page - 1) * params.limit;
    const sqlQuery = `SELECT courses.*,
        COUNT(*) OVER()::int as total_records,
        COALESCE(AVG(reviews.rating), 0)::float as average_rating,
        COUNT(reviews.id)::int as total_reviews
                  FROM courses
                           LEFT JOIN reviews ON courses.id = reviews.course_id
                  WHERE
                      ($1::int IS NULL OR courses.category_id = $1)
                    AND
                      ($2::text IS NULL OR courses.title ILIKE '%' || $2 || '%')
                  GROUP BY courses.id
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
        params.category_id || null,
        params.search || null,
        params.sort || 'newest',
        params.limit,
        offset
    ];
    return pool.query(sqlQuery, values);
};