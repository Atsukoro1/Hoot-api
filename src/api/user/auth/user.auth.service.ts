import { Injectable } from '@nestjs/common';
import {
  ILoginReq,
  IRegisterReq,
  IUserAuthResponse,
  UserAuthResponse,
} from './user.auth.interfaces';
import * as bcrypt from 'bcrypt';
import { User } from '../../../schema/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserAuthService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async register(body: IRegisterReq): Promise<IUserAuthResponse> {
    const existingUser = await this.userModel.findOne({ email: body.email });
    if (existingUser)
      return new UserAuthResponse(
        false,
        'User with this email address already exists!',
        undefined,
      );

    const newUser = new this.userModel(body);

    newUser.password = await bcrypt.hash(newUser.password, 10);

    await newUser.save();

    const token = await jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);

    return new UserAuthResponse(true, undefined, {
      token: token,
      _id: newUser._id,
    });
  }

  async login(body: ILoginReq): Promise<IUserAuthResponse> {
    const existingUser = await this.userModel.findOne({ email: body.email });
    if (!existingUser)
      return new UserAuthResponse(
        false,
        'Invalid password or email!',
        undefined,
      );

    const passwordMatch = await bcrypt.compare(
      body.password,
      existingUser.password,
    );

    if (!passwordMatch)
      return new UserAuthResponse(
        false,
        'Invalid password or email!',
        undefined,
      );

    const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET);
    return new UserAuthResponse(true, undefined, { token: token, _id: existingUser._id });
  }
}
