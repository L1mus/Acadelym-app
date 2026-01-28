export interface ReviewsEntity {
    id: number;
    user_id: number;
    course_id: number;
    rating: number;
    comments: string | null;
    created_at: Date;
}