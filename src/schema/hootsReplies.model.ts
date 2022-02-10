import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type HootsRepliesDocument = HootsReplies & Document;

@Schema()
export class HootsReplies {
    @Prop({ default: Date.now })
    createdAt: number;

    @Prop({ required: true, ref: "User" })
    author: string;

    @Prop({ required: false })
    textContent: string;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Hoots" })
    isReplyTo?: MongooseSchema.Types.ObjectId;

    @Prop({ default: [] })
    hearts: Array<string>;
}

const HootsRepliesSchema = SchemaFactory.createForClass(HootsReplies);

export { HootsRepliesSchema }