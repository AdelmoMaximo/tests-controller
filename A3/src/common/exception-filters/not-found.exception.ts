import { HttpException, HttpStatus } from "@nestjs/common";

export class NotFoundException extends HttpException {
    constructor(message: string) {
      super(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: message,
          error: "Not Found",
        },
        HttpStatus.NOT_FOUND
      );
    }
}
  