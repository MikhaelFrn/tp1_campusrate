import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PlaceCategory } from '../../enums/place-category.enum.js';
import { PlaceStatus } from '../../enums/place-state.enum.js';

@Schema({ timestamps: true })
export class Place extends Document {
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: PlaceCategory })
  category: PlaceCategory;

  @Prop({ required: true })
  address: string;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ required: true, enum: PlaceStatus, default: PlaceStatus.ACTIVE })
  status: PlaceStatus;

  @Prop({ type: Number, default: null })
  averageRating: number | null;

  @Prop({ type: Number, default: 0 })
  reviewCount: number;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);