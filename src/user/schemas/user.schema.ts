import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

enum Gender {
  Male = 'male',
  Female = 'female',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  about: string;

  @Prop({ type: [String], default: [] })
  interest: string[];

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ required: true })
  birthday: Date;

  @Prop({ default: '' })
  horoscope: string;

  @Prop({ default: '' })
  zodiac: string;

  @Prop({ type: Number, default: 0 })
  height: number;

  @Prop({ type: Number, default: 0 })
  weight: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
