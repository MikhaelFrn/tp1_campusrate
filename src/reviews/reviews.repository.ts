import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schema/review.schema.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>
  ) {}

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find().exec();
  }

  async findById(id: string): Promise<Review | null> {
    return this.reviewModel.findById(id).exec();
  }

  async create(data: CreateReviewDto): Promise<Review> {
    return this.reviewModel.create(data);
  }

  async update(id: string, data: UpdateReviewDto): Promise<Review | null> {
    return this.reviewModel.findByIdAndUpdate(id, data, { returnDocument: 'after' }).exec();
  }

  async remove(id: string): Promise<Review | null> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }
}