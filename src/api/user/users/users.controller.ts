import { Controller, Get, Body, Post, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import * as Joi from 'joi';
import {
  IUsersResponse,
  UsersResponse,
  ISearchRequest,
  IProfileRequest,
} from './users.interfaces';
import { isValidObjectId } from 'mongoose';
import {
  validate,
  searchSchema,
  getFollowsSchema,
  getProfileSchema,
} from './users.validators';

@Controller('/api/user/')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/search')
  async searchUsers(
    @Body() body,
    @Query() query: ISearchRequest,
  ): Promise<IUsersResponse> {
    query.userId = body.userId;

    const validation = await validate(query, searchSchema);
    if (validation) return validation;

    const response = await this.userService.searchUsers(query);
    return response;
  }

  @Get('/profile')
  async fetchProfile(
    @Body() body,
    @Query() query: IProfileRequest,
  ): Promise<IUsersResponse> {
    query.userId = body.userId;

    const validation = await validate(query, getProfileSchema);
    if (validation) return validation;

    const response = await this.userService.fetchProfile(query);
    return response;
  }

  @Get('followers')
  async fetchFollowers(@Body() body, @Query() query) {
    query.userId = body.userId;

    const validation = await validate(query, getFollowsSchema);
    if (validation) return validation;

    const response = await this.userService.fetchFollow(query, 'followers');
    return response;
  }

  @Get('/following')
  async fetchFollowing(@Body() body, @Query() query) {
    query.userId = body.userId;

    const validation = await validate(query, getFollowsSchema);
    if (validation) return validation;

    const response = await this.userService.fetchFollow(query, 'following');
    return response;
  }
}
