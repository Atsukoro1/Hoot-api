import { Module } from '@nestjs/common';
import { UserAuthController } from './user.auth.controller';
import { UserAuthService } from './user.auth.service';
import { UserSchema } from '../../../schema/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ConfigModule.forRoot(),
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService],
})
export class UserAuthModule {}
