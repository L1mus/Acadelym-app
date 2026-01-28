export type OrderStatus= 'pending'|'completed'|'cancelled';

export interface OrdersEntity {
    id: number;
    user_id: number;
    course_id: number;
    status: OrderStatus;
}