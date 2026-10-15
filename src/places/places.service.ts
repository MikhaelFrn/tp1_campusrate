import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { Place } from './schema/place.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class PlacesService {
  constructor(@InjectModel(Place.name) private readonly placeModel: Model<Place>) {}

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.placeModel.create(createPlaceDto);
  }

  async findAll(category?: string, status?: string, page = 1, limit = 10): Promise<{ data: Place[]; pagination: { page: number; limit: number; totalItems: number; totalPages: number } }> {
    const MAX_LIMIT = 20;
    const limitVerif = limit > MAX_LIMIT ? MAX_LIMIT : limit;
    const skip = (page - 1) * limitVerif;
    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const [data, totalItems] = await Promise.all([
      this.placeModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.placeModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      data,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };  }

  async findById(id: string): Promise<Place> {
    const place = await this.placeModel.findById(id).exec();
    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);      
    }
    return place;
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const place = await this.placeModel.findByIdAndUpdate(
      {_id: id},
      { $set: updatePlaceDto },
      { new: true,
        runValidators: true,
      },
    ).exec();
    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }
    return place;
  }

  async remove(id: string) {
    const deletePlace = await this.placeModel.findByIdAndDelete(id).exec();
    if (!deletePlace) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }
  }
}
