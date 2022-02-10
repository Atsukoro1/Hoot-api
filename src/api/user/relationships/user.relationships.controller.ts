import { Controller, Post, Body, Delete, Query } from '@nestjs/common';
import {
  IRelationshipsResponse,
  IRemoveFollowQuery,
  IBlockQuery,
  IFollowQuery,
  IUnblockQuery,
  RelationshipsResponse,
} from './user.relationships.interfaces';
import { UserRelationshipsService } from './user.relationships.service';
import * as Joi from 'joi';
import { isValidObjectId } from 'mongoose';

@Controller('/api/user/relationships')
export class UserRelationshipsController {
  constructor(
    private readonly userRelationshipsService: UserRelationshipsService,
  ) {}

  @Post('/followers')
  async follow(
    @Body('userId') userId,
    @Query('id') query: IFollowQuery,
  ): Promise<IRelationshipsResponse> {
    if (!isValidObjectId(query))
      return new RelationshipsResponse(false, 'Invalid user id');

    if (query == userId)
      return new RelationshipsResponse(false, "You can't follow yourself!");

    const response = await this.userRelationshipsService.follow(userId, query);
    return response;
  }

  @Delete('/followers')
  async unfollow(
    @Body('userId') userId,
    @Query('id') query: IRemoveFollowQuery,
  ): Promise<IRelationshipsResponse> {
    if (!isValidObjectId(query))
      return new RelationshipsResponse(false, 'Invalid user id');

    const response = await this.userRelationshipsService.unfollow(
      userId,
      query,
    );
    return response;
  }

  @Post('/block')
  async block(
    @Body('userId') userId,
    @Query('id') query: IBlockQuery,
  ): Promise<IRelationshipsResponse> {
    if (!isValidObjectId(query))
      return new RelationshipsResponse(false, 'Invalid user id');

    if (query == userId)
      return new RelationshipsResponse(false, "You can't block yourself!");

    const response = await this.userRelationshipsService.block(userId, query);
    return response;
  }

  @Delete('/block')
  async unblock(
    @Body('userId') userId,
    @Query('id') query: IUnblockQuery,
  ): Promise<IRelationshipsResponse> {
    if (!isValidObjectId(query))
      return new RelationshipsResponse(false, 'Invalid user id');

    const response = await this.userRelationshipsService.unblock(userId, query);
    return response;
  }
}
