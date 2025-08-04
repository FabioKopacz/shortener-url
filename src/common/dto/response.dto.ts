import { HttpStatus } from '@nestjs/common/enums';

export class BaseResponseDTO<T = null> {
  data?: T;
  message: string;
  code: HttpStatus;

  constructor({
    code = HttpStatus.OK,
    data,
    message,
  }: {
    data?: T;
    message: string;
    code?: HttpStatus;
  }) {
    this.data = data;
    this.message = message;
    this.code = code;
  }
}
