import { HttpException } from "@nestjs/common";
import { AxiosExceptionErrorInterface } from "./interfaces/axios-exception-error.interface";

export class AxiosException extends HttpException {
    constructor(axiosError: AxiosExceptionErrorInterface) {
      const { error, message, statusCode } = axiosError;
      super(
        {
          statusCode,
          message,
          error
        },
        statusCode
      );
    }
}
  