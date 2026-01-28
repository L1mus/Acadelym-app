export interface UserprogressEntity {
    id: number;
    user_id: number;
    lesson_id: number;
    is_completed: boolean;
    created_at: Date;
    updated_at: Date | null;
}