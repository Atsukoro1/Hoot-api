import { Module } from '@nestjs/common';
import { UserSchema } from '../../schema/user.model';
import { HootsSchema } from 'src/schema/hoots.model';
import { HootsRepliesSchema } from 'src/schema/hootsReplies.model';
import { HootsController } from './hoots.controller';
import { HootsService } from './hoots.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer } from '@nestjs/common';
import { CheckJwtMiddleware } from 'src/middleware/middleware.verifyJwt';
import { NestModule } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Hoots', schema: HootsSchema },
      { name: 'HootsReplies', schema: HootsRepliesSchema },
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [HootsController],
  providers: [HootsService],
})
export class HootsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckJwtMiddleware).forRoutes('/api/hoots');
  }
}
