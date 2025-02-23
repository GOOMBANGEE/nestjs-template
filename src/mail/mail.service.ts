import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationCodeMail(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email, // 수신자 이메일
      subject: subject, // 메일 제목
      template: './activationCodeMail', // 이메일 템플릿 경로 (templates/activationCode.hbs)
      context: {
        // 템플릿에 전달할 데이터
        message,
      },
    });
  }

  async sendResetPasswordMail(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      template: './resetPasswordMail',
      context: {
        message,
      },
    });
  }
}
