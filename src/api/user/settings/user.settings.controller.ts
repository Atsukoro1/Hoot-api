import { Controller, Patch, Body, Delete } from '@nestjs/common';
import { UserSettingsService } from './user.settings.service';
import {
  IChangeReq,
  IUserSettingsResponse,
  UserSettingsResponse,
  IDeleteReq,
} from './user.settings.interfaces';
import * as Joi from 'joi';
import { validate, userSettingsSchema } from './user.settings.validators';

@Controller('/api/user/settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Patch('/change')
  async change(@Body() body: IChangeReq): Promise<IUserSettingsResponse> {
    const validation = await validate(body, userSettingsSchema);
    if (validation) return validation;

    const response = await this.userSettingsService.change(body);
    return response;
  }

  @Delete('/delete')
  async delete(@Body() body: IDeleteReq): Promise<IUserSettingsResponse> {
    const response = await this.userSettingsService.delete(body);
    return response;
  }
}
