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

  @Prop({
    type: Boolean,
    default: false,
  })
  verified: boolean;

  @Prop({
    type: String,
  })
  OTPCode: string;
  @Prop({
    type: String,
  })
  OTPValidationDate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
