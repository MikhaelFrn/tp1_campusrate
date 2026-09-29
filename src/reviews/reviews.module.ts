import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { ReviewsController } from './reviews.controller.js';
import { DataStorageService } from '../data/data-storage.service.js';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, DataStorageService],
})
export class ReviewsModule {}
