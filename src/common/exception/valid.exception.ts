import { HttpException, HttpStatus } from '@nestjs/common';

interface ValidationError {
  property: string;
  message: string;
}

export const VALIDATION_ERROR = {
  EMAIL_ERROR: '이메일 유효성 검사를 통과하지 못했습니다',
  USERNAME_ERROR: '유저명 유효성 검사를 통과하지 못했습니다',
  PASSWORD_ERROR: '비밀번호 유효성 검사를 통과하지 못했습니다',
  ACTIVATION_CODE_INVALID: '코드가 유효하지 않습니다',
  ID_ERROR: '올바르지 않은 ID입니다',
  TITLE_ERROR: '제목이 비어있습니다',
  CONTENT_ERROR: '내용이 비어있습니다',
  VALUE_INVALID: '허용되지 않는 값입니다',
};

export class ValidException extends HttpException {
  constructor(public readonly error: ValidationError[]) {
    super(ValidException.getMessage(error), HttpStatus.BAD_REQUEST);
  }

  private static getMessage(error: ValidationError[]) {
    if (!error || error.length === 0) return '알 수 없는 오류';

    // error: [ { property: 'email', message: 'VALID:EMAIL_ERROR' } ]
    const message = error[0]?.message;
    return message || '알 수 없는 오류';
  }
}
