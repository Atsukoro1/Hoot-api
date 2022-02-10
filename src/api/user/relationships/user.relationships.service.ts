import { Injectable } from '@nestjs/common';
import { User } from '../../../schema/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IRemoveFollowQuery,
  IBlockQuery,
  IFollowQuery,
  IUnblockQuery,
  IRelationshipsResponse,
  RelationshipsResponse,
} from './user.relationships.interfaces';
import { Relationships } from '../../../schema/relationships.model';

@Injectable()
export class UserRelationshipsService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Relationships') private relationships: Model<Relationships>,
  ) {}

  async unblock(
    userId: string,
    query: IUnblockQuery,
  ): Promise<IRelationshipsResponse> {
    const targetUser = await this.userModel.findById(query);
    if (!targetUser)
      return new RelationshipsResponse(false, 'This user does not exist!');

    const actualRelationsships = await this.relationships.find({
      from: userId,
      to: query,
      $or: [{ type: 1 }, { type: 2 }],
    });
    if (typeof actualRelationsships.find((el) => el.type == 2) == 'undefined')
      return new RelationshipsResponse(false, "You didn't block this user!");

    await this.relationships.findOneAndDelete({
      type: 2,
      from: userId,
      to: query,
    });
    return new RelationshipsResponse(true, undefined);
  }

  async block(
    userId: string,
    query: IBlockQuery,
  ): Promise<IRelationshipsResponse> {
    const targetUser = await this.userModel.findById(query);
    if (!targetUser)
      return new RelationshipsResponse(false, 'This user does not exist!');

    const actualRelationsships = await this.relationships.find({
      from: userId,
      to: query,
      $or: [{ type: 1 }, { type: 2 }],
    });
    if (typeof actualRelationsships.find((el) => el.type == 2) != 'undefined')
      return new RelationshipsResponse(false, 'You already blocked this user!');
    if (typeof actualRelationsships.find((el) => el.type == 1) != 'undefined')
      return new RelationshipsResponse(false, "You can't block followed user!");

    const newRelationship = new this.relationships({
      type: 2,
      from: userId,
      to: query,
    });

    await newRelationship.save();

    return new RelationshipsResponse(true, undefined);
  }

  async follow(
    userId: string,
    query: IFollowQuery,
  ): Promise<IRelationshipsResponse> {
    const targetUser = await this.userModel.findById(query);
    if (!targetUser)
      return new RelationshipsResponse(false, 'This user does not exist!');

    const actualRelationsships = await this.relationships.find({
      from: userId,
      to: query,
      $or: [{ type: 1 }, { type: 2 }],
    });
    if (typeof actualRelationsships.find((el) => el.type == 1) != 'undefined')
      return new RelationshipsResponse(
        false,
        'You already followed this user!',
      );
    if (typeof actualRelationsships.find((el) => el.type == 2) != 'undefined')
      return new RelationshipsResponse(false, "You can't follow blocked user!");

    const newRelationship = new this.relationships({
      type: 1,
      from: userId,
      to: query,
    });

    await newRelationship.save();

    return new RelationshipsResponse(true, undefined);
  }

  async unfollow(
    userId: string,
    query: IRemoveFollowQuery,
  ): Promise<IRelationshipsResponse> {
    const targetUser = await this.userModel.findById(query);
    if (!targetUser)
      return new RelationshipsResponse(false, 'This user does not exist!');

    const actualRelationsships = await this.relationships.find({
      from: userId,
      to: query,
      $or: [{ type: 1 }, { type: 2 }],
    });
    if (typeof actualRelationsships.find((el) => el.type == 1) == 'undefined')
      return new RelationshipsResponse(false, "You didn't follow this user!");

    await this.relationships.findOneAndDelete({
      type: 1,
      from: userId,
      to: query,
    });

    return new RelationshipsResponse(true, undefined);
  }
}
