import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserSchema } from '../../../schema/user.model';
import { RelationshipsSchema } from '../../../schema/relationships.model';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserRelationshipsController } from './user.relationships.controller';
import { UserRelationshipsService } from './user.relationships.service';
import { CheckJwtMiddleware } from 'src/middleware/middleware.verifyJwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Relationships', schema: RelationshipsSchema },
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [UserRelationshipsController],
  providers: [UserRelationshipsService],
})
export class UserRelationshipsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckJwtMiddleware).forRoutes('/api/user/relationships');
  }
}
