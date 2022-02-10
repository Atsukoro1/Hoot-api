import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    ua: string;

    @Prop({ default: "Hi, i'am a new Hoot user!", required: false })
    bio: string;

    @Prop({ default: new Date(), required: false })
    createdAt: Date;

    @Prop({ default: [], ref: "Hoots" })
    hoots: string[];
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: "text", bio: "text" });
UserSchema.plugin(mongoosePaginate);

export { UserSchema };