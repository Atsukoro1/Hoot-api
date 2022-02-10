import { Controller, Post, Body, Headers } from '@nestjs/common';
import {
  ILoginReq,
  IRegisterReq,
  IUserAuthResponse,
} from './user.auth.interfaces';
import { UserAuthService } from './user.auth.service';
import { validate, registerSchema, loginSchema } from './user.auth.validators';

@Controller('/api/user/auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('/register')
  async register(
    @Body() body: IRegisterReq,
    @Headers('User-Agent') uaHeader,
  ): Promise<IUserAuthResponse> {
    const validation = await validate(body, registerSchema);
    if (validation) return validation;

    body.ua = uaHeader;

    const response = await this.userAuthService.register(body);
    return response;
  }

  @Post('/login')
  async login(@Body() body: ILoginReq): Promise<IUserAuthResponse> {
    const validation = await validate(body, loginSchema);
    if (validation) return validation;

    const response = await this.userAuthService.login(body);
    return response;
  }
}
