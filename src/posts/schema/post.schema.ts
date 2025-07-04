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
    type: {
      positions: {
        type: [String],
        required: true,
        validate: {
          validator: function (v: string[]) {
            return v && v.length > 0;
          },
          message: 'At least one position is required',
        },
      },
    },
    required: true,
    _id: false,
  })
  lookfor: {
    positions: string[];
  };
  @Prop({
    type: String,
    required: true,
  })
  contact: string;
  @Prop({
    type: String,
    default: 'Remote',
  })
  city: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  author: mongoose.Schema.Types.ObjectId;
}
export const PostSchema = SchemaFactory.createForClass(Post);
