export interface InstructorsEntity {
    user_id: number;
    title: string | null;
    company : string | null;
    bio: string | null;
    created_at: Date;
    updated_at: Date | null;
}