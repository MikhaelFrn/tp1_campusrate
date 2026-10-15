import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { ReviewsController } from './reviews.controller.js';
import { DataStorageService } from '../data/data-storage.service.js';
import { PlaceReviewsController } from './place-reviews.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewsController, PlaceReviewsController],
  providers: [ReviewsService, DataStorageService],
})
export class ReviewsModule {}
