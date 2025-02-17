import { HttpException, HttpStatus } from "@nestjs/common";

export class Unauthorized extends HttpException {
    constructor(message: string) {
      super(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: message,
          error: "Unauthorized",
        },
        HttpStatus.FORBIDDEN
      );
    }
}
  
  