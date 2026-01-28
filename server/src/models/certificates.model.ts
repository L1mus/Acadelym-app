export interface CertificatesEntity {
    id: number;
    certificate_code: string;
    user_id: number;
    course_id: number;
    date_issued:Date;
}