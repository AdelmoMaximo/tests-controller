export interface AxiosExceptionErrorInterface {
    readonly statusCode: number;
    readonly message: string;
    readonly error: string | string[] ;
}
  