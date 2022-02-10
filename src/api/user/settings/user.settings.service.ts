import { Injectable } from '@nestjs/common';
import {
  IChangeReq,
  IUserSettingsResponse,
  UserSettingsResponse,
  IDeleteReq,
} from './user.settings.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../schema/user.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSettingsService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async change(body: IChangeReq): Promise<IUserSettingsResponse> {
    const updateData: any = {};

    const existingUser = await this.userModel.findById(body.userId);
    const match = await bcrypt.compare(body.password, existingUser.password);

    if (!match)
      return new UserSettingsResponse(false, "Passwords doesn't match!");

    if (body.newEmail) {
      const existingMailUser = await this.userModel.findOne({
        email: body.newEmail,
      });
      if (existingMailUser)
        return new UserSettingsResponse(
          false,
          'User with this email already exists!',
        );

      updateData.email = body.newEmail;
    }

    if (body.newPassword) {
      const hash = await bcrypt.hash(body.newPassword, 10);
      updateData.password = hash;
    }

    if (body.newUsername) updateData.username = body.newUsername;
    if (body.newBio) updateData.bio = body.newBio;

    await this.userModel.findByIdAndUpdate(body.userId, updateData);
    return new UserSettingsResponse(true, undefined);
  }

  async delete(body: IDeleteReq): Promise<IUserSettingsResponse> {
    await this.userModel.findByIdAndRemove(body.userId);
    return new UserSettingsResponse(true, undefined);
  }
}
