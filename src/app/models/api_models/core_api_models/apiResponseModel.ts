export interface ApiResponseModel<T> {
    statusCode: number;
    message: string;
    data: T;
}
