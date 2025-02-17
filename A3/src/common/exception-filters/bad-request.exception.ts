import { HttpException, HttpStatus } from "@nestjs/common";

export class BadRequestException extends HttpException {
    constructor(message: string | string[]) {
      super(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: message,
          error: "Bad Request",
        },
        HttpStatus.BAD_REQUEST
      );
    }
}
  