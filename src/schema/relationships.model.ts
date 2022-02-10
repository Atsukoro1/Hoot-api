import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2";

export type RelationshipsDocument = Relationships & Document;

@Schema()
export class Relationships {
    @Prop({ required: true })
    type: number;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
    from: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
    to: MongooseSchema.Types.ObjectId;

    @Prop({ default: Date.now() })
    createdAt: Date;
}

const RelationshipsSchema = SchemaFactory.createForClass(Relationships);

RelationshipsSchema.plugin(mongoosePaginate);

export { RelationshipsSchema };