export type InvoiceStatus = 'paid' | 'unpaid' | 'pending';

export interface InvoicesEntity {
    id: string;
    order_id: number;
    invoice_number: string;
    payment_method_id: number;
    amount: number;
    created_at: Date;
    status: InvoiceStatus;
}