import { Injectable } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { User } from '../../../schema/user.model';
import { Relationships } from 'src/schema/relationships.model';
import { Model, Types } from 'mongoose';
import { Hoots } from 'src/schema/hoots.model';
import { Bookmark } from 'src/schema/bookmark.model';
import {
  IUsersResponse,
  UsersResponse,
  ISearchRequest,
  IProfileRequest,
} from './users.interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Relationships')
    private relationshipsModel: Model<Relationships>,
    @InjectModel('Hoots') private hootsModel: Model<Hoots>,
    @InjectModel('Bookmark') private bookmarkModel: Model<Bookmark>,
  ) {}

  async searchUsers(body: ISearchRequest): Promise<IUsersResponse> {
    const options = {
      page: body.page ? body.page : 1,
      limit: 10,
      lean: false,
      useEstimatedCount: true,
      select: '-password -ua',
    };

    // @ts-ignore
    const result = await this.userModel.paginate(
      { username: { $regex: body.query, $options: 'i' } },
      options,
    );

    return new UsersResponse(false, undefined, result);
  }

  async fetchProfile(body: IProfileRequest): Promise<IUsersResponse> {
    const user = await this.userModel.findById(
      body.id,
      {},
      { select: '-password -ua' },
    );

    body.page ? body.page : (body.page = 1);
    const idsToGet: string[] | Array<object> = user.hoots.splice(
      (body.page - 1) * 10,
      10,
    );

    const hoots = await this.hootsModel.find({ _id: { $in: idsToGet }}).populate("author", "_id username").exec();

    const data: any = {};
    data.user = user;
    data.hoots = hoots;

    return new UsersResponse(true, undefined, data);
  }

  async fetchFollow(body, type) {
    const options = {
      page: body.page ? body.page : 1,
      limit: 10,
      lean: false,
      useEstimatedCount: true,
      populate: {
        path: 'to',
        select: '-password -ua',
      },
    };

    let result;

    if (type == 'following') {
      // @ts-ignore
      result = await this.relationshipsModel.paginate(
        { from: body.userId, type: 1 },
        options,
      );
    } else {
      // @ts-ignore
      result = await this.relationshipsModel.paginate(
        { to: body.userId, type: 1 },
        options,
      );
    }

    return result;
  }
}
