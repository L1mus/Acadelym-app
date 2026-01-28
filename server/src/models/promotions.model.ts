export interface PromotionsEntity {
    id : number;
    course_id : number;
    code : string;
    discount_percentage : number;
    start_date : Date;
    end_date : Date;
    is_active : boolean;
    created_at: Date;
    updated_at: Date | null;
}