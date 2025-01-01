import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// header: 'bearer access_token'
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
