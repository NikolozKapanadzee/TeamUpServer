import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'post',
    default: [],
  })
  posts: mongoose.Types.ObjectId[];
  @Prop({
    type: String,
    select: false,
  })
  resetPasswordToken?: string;

  @Prop({
    type: Date,
    select: false,
  })
  resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
