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

    const options = {
      page: body.page ? body.page : 1,
      limit: 10,
      lean: false,
      select: "-__v ",
      sort: { createdAt: -1 },
      populate: {
        path: 'author',
        select: '_id username',
      }
    };

    // @ts-ignore
    const hoots = await this.hootsModel.paginate({ author: user._id }, options);

    const data: any = {};
    data.user = user;
    data.hoots = hoots;

    const relationships = await this.relationshipsModel.find({ from: body.userId, to: body.id });

    // Check if request author followed or blocked this user
    relationships.find(el => el.type == 1) ? data.followed = true : data.followed = false;
    relationships.find(el => el.type == 2) ? data.blocked = true : data.blocked = false;

    return new UsersResponse(true, undefined, data);
  }

  async fetchFollow(body, type) {
    const options = {
      page: body.page ? body.page : 1,
      limit: 10,
      lean: false,
      populate: {
        path: 'to',
        select: '-password -ua -email',
      },
    };

    type == "following" ? options.populate.path = "to" : options.populate.path = "from";
    const query = type == "following" ? { from: body.id, type: 1 } : { to: body.id, type: 1 };

    // @ts-ignore
    const result = await this.relationshipsModel.paginate(
      query,
      options,
    );

    return result;
  }
}
