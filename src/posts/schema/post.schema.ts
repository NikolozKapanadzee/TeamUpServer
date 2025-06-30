import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
    type: String,
    required: true,
  })
  lookfor: string[];
  @Prop({
    type: String,
    required: true,
  })
  contact: string;
}
export const PostSchema = SchemaFactory.createForClass(Post);
