import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../../schema/user.model';
import { ConfigModule } from '@nestjs/config';
import { CheckJwtMiddleware } from '../../../middleware/middleware.verifyJwt';
import { RelationshipsSchema } from 'src/schema/relationships.model';
import { HootsSchema } from 'src/schema/hoots.model';
import { BookmarksSchema } from 'src/schema/bookmark.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Relationships', schema: RelationshipsSchema },
      { name: 'Hoots', schema: HootsSchema },
      { name: 'Bookmark', schema: BookmarksSchema },
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckJwtMiddleware).forRoutes('/api/users/');
  }
}
