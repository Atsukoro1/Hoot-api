import {
  Controller,
  Post,
  Delete,
  Patch,
  Put,
  Body,
  Query,
  Get,
} from '@nestjs/common';
import {
  ICreateReq,
  IGetReq,
  IDeleteReactionReq,
  IDeleteReq,
  IEditReq,
  IHootResponse,
  IReactReq,
  HootResponse,
  ISearchReq,
} from './hoots.interfaces';
import {
  validate,
  getSchema,
  reactSchema,
  searchSchema,
  createSchema,
  deleteSchema,
  deleteReactionSchema,
  editSchema,
} from './hoots.validators';
import { HootsService } from './hoots.service';
import { isValidObjectId } from 'mongoose';
import * as Joi from 'joi';

@Controller('/api/hoots')
export class HootsController {
  constructor(private readonly hootsService: HootsService) {}

  @Post()
  async create(@Body() body: ICreateReq): Promise<IHootResponse> {
    body.author = body.userId;

    const validation = await validate(body, createSchema);
    if (validation) return validation;

    const response = await this.hootsService.create(body);
    return response;
  }

  @Get()
  async get(@Query() body: IGetReq): Promise<IHootResponse> {
    const validation = await validate(body, getSchema);
    if (validation) return validation;

    const response = await this.hootsService.get(body);
    return response;
  }

  @Delete()
  async delete(@Body() body: IDeleteReq): Promise<IHootResponse> {
    const validation = await validate(body, deleteSchema);
    if (validation) return validation;

    const response = await this.hootsService.delete(body);
    return response;
  }

  @Patch()
  async edit(@Body() body: IEditReq): Promise<IHootResponse> {
    const validation = await validate(body, editSchema);
    if (validation) return validation;

    const response = await this.hootsService.edit(body);
    return response;
  }

  @Put('/reactions')
  async react(@Body() body: IReactReq): Promise<IHootResponse> {
    const validation = await validate(body, reactSchema);
    if (validation) return validation;

    const response = await this.hootsService.react(body);
    return response;
  }

  @Delete('/reactions')
  async removeReaction(
    @Body() body: IDeleteReactionReq,
  ): Promise<IHootResponse> {
    const validation = await validate(body, deleteReactionSchema);
    if (validation) return validation;

    const response = await this.hootsService.removeReaction(body);
    return response;
  }

  @Get('/search')
  async searchHoots(
    @Body() body,
    @Query() query: ISearchReq,
  ): Promise<IHootResponse> {
    query.userId = body.userId;

    const validation = await validate(body, searchSchema);
    if (validation) return validation;

    const response = await this.hootsService.search(query);
    return response;
  }
}
