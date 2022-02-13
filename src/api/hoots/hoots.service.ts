import { Injectable } from '@nestjs/common';
import { User } from '../../schema/user.model';
import { Hoots } from '../../schema/hoots.model';
import { HootsReplies } from 'src/schema/hootsReplies.model';
import { InjectModel } from '@nestjs/mongoose';
import { IHootResponse, HootResponse, ISearchReq } from './hoots.interfaces';
import { Model } from 'mongoose';

@Injectable()
export class HootsService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Hoots') private hootsModel: Model<Hoots>,
    @InjectModel('HootsReplies') private hootsRepliesModel: Model<HootsReplies>,
  ) {}

  async search(body: ISearchReq): Promise<IHootResponse> {
    const options = {
      page: body.page ? body.page : 1,
      limit: 10,
      sort: {
        createdAt: -1,
      },
      lean: false,
      useEstimatedCount: true,
    };

    // @ts-ignore
    const result = await this.hootsModel.paginate(
      { $text: { $search: body.query } },
      options,
    );
    return new HootResponse(false, undefined, result);
  }

  async create(body): Promise<IHootResponse> {
    if (body.isReplyTo) {
      const newHootReply = new this.hootsRepliesModel(body);
      await newHootReply.save();

      const hoot = await this.hootsModel.findById(newHootReply.isReplyTo);
      hoot.replies.push(newHootReply._id.toString());
      await hoot.save();

      const hootModelToReturn = await this.userModel.populate(newHootReply, { path: "author", select: "username _id" });

      return new HootResponse(true, undefined, hootModelToReturn);
    } else {
      const newHoot = new this.hootsModel(body);
      newHoot.save();

      const user = await this.userModel.findById(body.userId);
      user.hoots.push(newHoot._id.toString());
      user.save();

      const hootModelToReturn = await this.userModel.populate(newHoot, { path: "author", select: "username _id" });

      return new HootResponse(true, undefined, hootModelToReturn);
    }
  }

  async get(body): Promise<IHootResponse> {
    const response = await this.hootsModel
      .findById(body.id)

      .populate('author', '_id username')
      .populate({
        path: 'replies',
        options: {
          sort: { hearts: -1 },
        },
        populate: {
          path: 'author',
          select: '_id username',
        },
      });

    return new HootResponse(true, undefined, response);
  }

  async delete(body): Promise<IHootResponse> {
    const existingHoot = await this.hootsModel.findById(body.id);
    const existingReplyHoot = await this.hootsRepliesModel.findById(body.id);

    if (existingReplyHoot && existingReplyHoot.author == body.userId) {
      const oppositePost = await this.hootsModel.findById(
        existingReplyHoot.isReplyTo,
      );

      const index = oppositePost.replies.indexOf(
        existingReplyHoot._id.toString(),
      );
      oppositePost.replies.splice(index, 1);
      oppositePost.save();

      await existingReplyHoot.delete();

      return new HootResponse(true, undefined, existingReplyHoot);
    } else if (existingHoot && existingHoot.author == body.userId) {
      const user = await this.userModel.findById(body.userId);

      const hootIndex = user.hoots.indexOf(existingHoot._id.toString());
      user.hoots.splice(hootIndex, 1);
      await user.save();

      await this.hootsRepliesModel.findOneAndDelete({
        isReplyTo: existingHoot._id,
      });

      await existingHoot.delete();

      return new HootResponse(true, undefined, existingHoot);
    }

    return new HootResponse(
      false,
      'No hoot has been found or you do not have permissions to remove it...',
      undefined,
    );
  }

  async edit(body): Promise<IHootResponse> {
    const existingHoot = await this.hootsModel.findById(body.id);
    const existingReplyHoot = await this.hootsRepliesModel.findById(body.id);

    if (existingReplyHoot && existingReplyHoot.author == body.userId) {
      if (body.textContent) existingReplyHoot.textContent = body.textContent;

      await existingReplyHoot.save();
      return new HootResponse(true, undefined, existingReplyHoot);
    }

    if (existingHoot && existingHoot.author == body.userId) {
      if (body.textContent) existingHoot.textContent = body.textContent;
      if (body.hashtags) existingHoot.hashtags = body.hashtags;

      await existingHoot.save();
      return new HootResponse(true, undefined, existingHoot);
    }

    return new HootResponse(false, 'No hoot has been found...', undefined);
  }

  async react(body): Promise<IHootResponse> {
    const existingHoot = await this.hootsModel.findById(body.id);
    const existingReplyHoot = await this.hootsRepliesModel.findById(body.id);

    if (existingReplyHoot) {
      if (!existingReplyHoot.hearts.find((el) => el == body.userId))
        existingReplyHoot.hearts.push(body.userId);
      await existingReplyHoot.save();
      return new HootResponse(true, undefined, existingReplyHoot);
    } else if (existingHoot) {
      if (!existingHoot.hearts.find((el) => el == body.userId))
        existingHoot.hearts.push(body.userId);
      await existingHoot.save();
      return new HootResponse(true, undefined, existingHoot);
    }

    return new HootResponse(false, 'No hoot has been found...', undefined);
  }

  async removeReaction(body): Promise<IHootResponse> {
    const existingHoot = await this.hootsModel.findById(body.id);
    const existingReplyHoot = await this.hootsRepliesModel.findById(body.id);

    if (existingReplyHoot) {
      const index = existingReplyHoot.hearts.indexOf(body.userId);
      if (index != -1) existingReplyHoot.hearts.splice(index, 1);

      existingReplyHoot.save();
      return new HootResponse(true, undefined, existingReplyHoot);
    } else if (existingHoot) {
      const index = existingHoot.hearts.indexOf(body.userId);
      if (index != -1) existingHoot.hearts.splice(index, 1);

      existingHoot.save();
      return new HootResponse(true, undefined, existingHoot);
    }

    return new HootResponse(false, 'No hoot has been found...', undefined);
  }
}
