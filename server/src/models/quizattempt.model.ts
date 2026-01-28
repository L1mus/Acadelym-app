export interface QuizattemptEntity {
    id : number;
    user_id : number;
    chapter_id : number;
    score : number;
    attempt_date : Date;
}