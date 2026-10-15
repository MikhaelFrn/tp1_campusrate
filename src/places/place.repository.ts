import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place } from './schema/place.schema.js';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';

@Injectable()
export class PlaceRepository {
  constructor(
    @InjectModel(Place.name) private readonly placeModel: Model<Place>
  ) {}

  async findAll(): Promise<Place[]> {
    return this.placeModel.find().exec();
  }

  async findById(id: string): Promise<Place | null> {
    return this.placeModel.findById(id).exec();
  }

  async create(data: CreatePlaceDto): Promise<Place> {
    return this.placeModel.create(data);
  }

  async update(id: string, data: UpdatePlaceDto): Promise<Place | null> {
    return this.placeModel.findByIdAndUpdate(id, data, { returnDocument: 'after' }).exec();
  }

  async remove(id: string): Promise<Place | null> {
    return this.placeModel.findByIdAndDelete(id).exec();
  }
}