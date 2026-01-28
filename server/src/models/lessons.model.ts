export interface LessonsEntity {
    id: number;
    chapter_id: number;
    title: string;
    video_url: string | null;
    order_number: number;
    duration: number | null;
    created_at: Date;
    updated_at: Date | null;
}