export type levelCourse = 'beginner' | 'intermediate'| 'advanced';

export interface CourseEntity {
    id: number;
    title: string;
    description: string | null;
    instructor_id: number;
    price: number | null;
    thumbnail_url: string | null;
    is_published: boolean;
    level: levelCourse;
    created_at: Date;
    deleted_at: Date | null;
    updated_at: Date | null;
    category_id: number;
    original_price: number;
    slug: string;
}