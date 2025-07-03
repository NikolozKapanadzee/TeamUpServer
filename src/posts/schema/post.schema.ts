import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({
    type: String,
    required: true,
  })
  title: string;
  @Prop({
    type: String,
    required: true,
  })
  description: string;
  @Prop({
    type: Object,
    required: true,
  })
  lookfor: Record<string, string>;
  @Prop({
    type: String,
    required: true,
  })
  contact: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  author: mongoose.Schema.Types.ObjectId;
}
export const PostSchema = SchemaFactory.createForClass(Post);
