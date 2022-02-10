import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { HootsReplies, HootsRepliesSchema } from './hootsReplies.model';
import * as mongoosePaginate from "mongoose-paginate-v2"

export type HootsDocument = Hoots & Document;

@Schema()
export class Hoots {
    @Prop({ default: Date.now })
    createdAt: number;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
    author: MongooseSchema.Types.ObjectId;

    @Prop({ required: false })
    textContent: string;

    @Prop({ default: [] })
    hearts: Array<string>;

    @Prop({ default: [] })
    hashtags: Array<string>;

    @Prop({ default: [], ref: "HootsReplies" })
    replies: Array<string>
}

const HootsSchema = SchemaFactory.createForClass(Hoots);

HootsSchema.index({ textContent: "text", hashtags: "text" });
HootsSchema.plugin(mongoosePaginate);

export { HootsSchema };
