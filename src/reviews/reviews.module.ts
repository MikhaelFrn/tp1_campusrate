import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { ReviewsController } from './reviews.controller.js';
import { PlaceReviewsController } from './place-reviews.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema.js';
import { Place, PlaceSchema } from '../places/schema/place.schema.js'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Place.name, schema: PlaceSchema },
    ]),
  ],
  controllers: [ReviewsController, PlaceReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
