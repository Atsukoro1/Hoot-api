import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../../../schema/user.model";
import { ConfigModule } from "@nestjs/config";
import { UserSettingsController } from "./user.settings.controller";
import { UserSettingsService } from "./user.settings.service";
import { CheckJwtMiddleware } from "../../../middleware/middleware.verifyJwt";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
        ConfigModule.forRoot()
    ],
    controllers: [UserSettingsController],
    providers: [UserSettingsService]
})

export class UserSettingsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CheckJwtMiddleware).forRoutes("/api/user/settings")
    }
};