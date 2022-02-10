import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2"

export type BookmarkDocument = Bookmark & Document;

@Schema()
export class Bookmark {
    @Prop({ default: Date.now })
    createdAt: number;

    @Prop({ required: true })
    from: string;

    @Prop({ required: true, ref: "Hoots" })
    post: string;
}

const BookmarksSchema = SchemaFactory.createForClass(Bookmark);

BookmarksSchema.plugin(mongoosePaginate);

export { BookmarksSchema };
