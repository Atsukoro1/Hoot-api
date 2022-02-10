import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { UserAuthModule } from './api/user/auth/user.auth.module';
import { UserSettingsModule } from './api/user/settings/user.settings.module';
import { UserRelationshipsModule } from './api/user/relationships/user.relationships.module';
import { HootsModule } from './api/hoots/hoots.module';
import { MeModule } from './api/user/@me/@me.module';
import { UsersModule } from './api/user/users/users.module';

@Module({
  imports: [
    UserAuthModule,
    UserSettingsModule,
    UserRelationshipsModule,
    MeModule,
    HootsModule,
    UsersModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI)
  ]
})

export class AppModule {}