import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { ReviewsController } from './reviews.controller.js';
import { DataStorageService } from '../data/data-storage.service.js';
import { PlaceReviewsController } from './place-reviews.controller.js';

@Module({
  controllers: [ReviewsController, PlaceReviewsController],
  providers: [ReviewsService, DataStorageService],
})
export class ReviewsModule {}
