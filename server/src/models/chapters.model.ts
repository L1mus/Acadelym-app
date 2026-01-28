export interface ChaptersEntity {
    id: number;
    course_id: number;
    title: string;
    summary_url: string | null;
    order_number: number;
    created_at: Date;
}