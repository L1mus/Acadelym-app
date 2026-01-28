export interface QuizEntity {
    id: number;
    chapter_id: number;
    title: string;
    description: string |null;
    created_at: Date;
    updated_at: Date | null;
}