export interface PaymentMethodsEntity {
    id: number;
    name: string;
    logo_url : string | null;
    is_active: boolean | null;
}