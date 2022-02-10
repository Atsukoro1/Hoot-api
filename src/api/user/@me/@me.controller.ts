import { Controller, Get, Body, Post, Delete, Query } from '@nestjs/common';
import { MeService } from './@me.service';
import {
  IFeedFetchRequest,
  IMeResponse,
  IMeFetchRequest,
  IAddBookmarkReq,
  IRemoveBookmarkReq,
  IFetchBookmarksReq,
} from './@me.interfaces';
import {
  blockedValidator,
  bookmarkValidator,
  validate,
} from './@me.validators';

@Controller('/api/user/@me')
export class MeController {
  constructor(private readonly userMeService: MeService) {}

  @Post('/bookmarks')
  async addBookmark(
    @Body() body: IAddBookmarkReq,
    @Query() query,
  ): Promise<IMeResponse> {
    query.userId = body.userId;

    const validation = validate(query, bookmarkValidator);
    if (validation) return validation;

    const response = await this.userMeService.addBookmark(query);
    return response;
  }

  @Get('/bookmarks')
  async fetchBookmarks(
    @Body() body: IFetchBookmarksReq,
    @Query() query,
  ): Promise<IMeResponse> {
    body.page = query.page;

    const response = await this.userMeService.fetchBookmarks(body);
    return response;
  }

  @Delete('/bookmarks')
  async removeBookmark(
    @Body() body: IRemoveBookmarkReq,
    @Query() query,
  ): Promise<IMeResponse> {
    query.userId = body.userId;

    const validation = validate(query, bookmarkValidator);
    if (validation) return validation;

    const response = await this.userMeService.removeBookmark(query);
    return response;
  }

  @Get('/feed')
  async fetchFeed(
    @Body() body: IFeedFetchRequest,
    @Query() query,
  ): Promise<IMeResponse> {
    body.page = query.page;

    const response = await this.userMeService.fetchFeed(body);
    return response;
  }

  @Get('/')
  async fetchMe(@Body() body: IMeFetchRequest): Promise<IMeResponse> {
    const response = await this.userMeService.fetchMe(body);
    return response;
  }

  @Get('/blocked')
  async fetchBlocked(@Body() body) {
    const validation = validate(body, blockedValidator);
    if (validation) return validation;

    const response = await this.userMeService.fetchBlocked(body);
    return response;
  }
}
