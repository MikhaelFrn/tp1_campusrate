import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { Review } from './schema/review.schema.js';
import { Place } from '../places/schema/place.schema.js'; // Ajuste le chemin vers ton schéma Place
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Place.name) private readonly placeModel: Model<Place>
  ) {}

  async create(placeId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    const review = await this.reviewModel.create({
      ...createReviewDto,
      placeId: new Types.ObjectId(placeId),
    });
    
    await this.recalculatePlaceStats(placeId);
    return review;
  }

  async findAllForPlace(placeId: string, page = 1, limit = 10): Promise<{ data: Review[]; pagination: { page: number; limit: number; totalItems: number; totalPages: number } }> {
    const skip = (page - 1) * limit;
    const filter = { placeId: new Types.ObjectId(placeId) };

    const [data, totalItems] = await Promise.all([
      this.reviewModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.reviewModel.countDocuments(filter).exec(),
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
    };
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewModel.findByIdAndUpdate(
      { _id: id},
      { $set: updateReviewDto },
      { new: true, runValidators: true },
    ).exec();
    
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    await this.recalculatePlaceStats(review.placeId.toString());
    return review;
  }

  async remove(id: string): Promise<void> {
    const review = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    await this.recalculatePlaceStats(review.placeId.toString());
  }

  private async recalculatePlaceStats(placeId: string): Promise<void> {
    const placeObjectId = new Types.ObjectId(placeId);

    const stats = await this.reviewModel.aggregate([
      { $match: { placeId: placeObjectId } },
      {
        $group: {
          _id: '$placeId',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const reviewCount = stats.length > 0 ? stats[0].reviewCount : 0;
    const averageRating = reviewCount === 0 ? null : Number(stats[0].averageRating.toFixed(2)); // Arrondi optionnel à 2 décimales

    await this.placeModel.findByIdAndUpdate(placeObjectId, {
      averageRating,
      reviewCount,
    }).exec();
  }
}