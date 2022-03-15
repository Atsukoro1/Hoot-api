import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../schema/user.model';
import { Relationships } from 'src/schema/relationships.model';
import { Model, Types } from 'mongoose';
import {
  MeResponse,
  IAddBookmarkReq,
  IMeResponse,
  IRemoveBookmarkReq,
  IFeedFetchRequest,
  IMeFetchRequest,
} from './@me.interfaces';
import { Hoots } from 'src/schema/hoots.model';
import { Bookmark } from 'src/schema/bookmark.model';

@Injectable()
export class MeService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Relationships')
    private relationshipsModel: Model<Relationships>,
    @InjectModel('Hoots') private hootsModel: Model<Hoots>,
    @InjectModel('Bookmark') private bookmarkModel: Model<Bookmark>,
  ) {}

  async fetchFeed(body: IFeedFetchRequest): Promise<IMeResponse> {
    const response = await this.relationshipsModel.find(
      { from: body.userId, type: 1 },
      {},
      { select: 'to -_id' },
    );

    let userIds = response.map(
      (user) => new Types.ObjectId(user.to.toString()),
    );

    userIds.push(new Types.ObjectId(body.userId.toString()))

    const options = {
      page: body.page ? body.page : 1,
      limit: 10,
      select: "-replies",
      sort: {
        createdAt: -1,
      },
      lean: false,
      populate: {
        path: 'author',
        select: '_id username',
      },
    };

    //@ts-ignore
    const result = await this.hootsModel.paginate(
      { author: { $in: userIds } },
      options,
    );

    return new MeResponse(true, undefined, result);
  }

  async fetchMe(body: IMeFetchRequest): Promise<IMeResponse> {
    const response = await this.userModel.findOne(
      { _id: body.userId },
      {},
      { select: '-password -ua' },
    );

    if (!response) return new MeResponse(false, 'No user found', undefined);

    return new MeResponse(true, undefined, response);
  }

  async addBookmark(body: IAddBookmarkReq): Promise<IMeResponse> {
    const post = await this.hootsModel.findById(body.id);
    if (!post)
      return new MeResponse(false, 'No post with this id found!', undefined);

    const acutalBookmark = await this.bookmarkModel.findOne({
      post: post._id,
      from: body.userId,
    });
    if (acutalBookmark)
      return new MeResponse(
        false,
        'You already bookmarked this post!',
        undefined,
      );

    const newBookmark = new this.bookmarkModel({
      post: post._id,
      from: body.userId,
    });
    await newBookmark.save();

    return new MeResponse(true, undefined, newBookmark);
  }

  async removeBookmark(body: IRemoveBookmarkReq): Promise<IMeResponse> {
    const bookmark = await this.bookmarkModel.findOneAndRemove({
      from: body.userId,
      post: body.id,
    });

    return new MeResponse(false, undefined, bookmark);
  }

  async fetchBookmarks(body): Promise<IMeResponse> {
    const options = {
      page: body.page ? body.page : 1,
      limit: 10,
      sort: {
        createdAt: -1,
      },
      lean: false,
      populate: {
        path: 'post',
        select: '_id author textContent',
      },
    };

    //@ts-ignore
    const bookmarks = await this.bookmarkModel.paginate(
      { from: body.userId },
      options,
    );

    return new MeResponse(false, undefined, bookmarks);
  }

  async fetchBlocked(body) {
    const options = {
      page: body.page ? body.page : 1,
      limit: 10,
      sort: {
        createdAt: -1,
      },
      lean: false,
      populate: {
        path: 'to',
        select: '-password -ua',
      },
    };

    //@ts-ignore
    const result = await this.relationshipsModel.paginate(
      { from: body.userId, type: 2 },
      options,
    );
    return result;
  }
}
