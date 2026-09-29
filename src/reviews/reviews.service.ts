import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { DataStorageService } from '../data/data-storage.service.js';
import { Review } from './entities/review.entity.js';
import { Place } from '../places/entities/place.entity.js';

@Injectable()
export class ReviewsService {
  constructor(private readonly dataStorageService: DataStorageService) {}

  async create(placeId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    createReviewDto.comment = createReviewDto.comment.trim();

    const places = await this.dataStorageService.readData('places') as Place[];
    const place = places.find(p => p.id === placeId);

    if (place === undefined) {
      throw new NotFoundException(`Place with id ${placeId} not found`);
    }

    const reviewCreated = new Review(placeId, createReviewDto.rating, createReviewDto.comment);
    const reviews = await this.dataStorageService.readData('reviews') as Review[];
    reviews.push(reviewCreated);
    
    await this.dataStorageService.writeData('reviews', reviews);
    await this.recalculatePlaceStats(placeId);
    return reviewCreated;
  }

  async findAllForPlace(placeId: string, page = 1, limit = 10): Promise<{ data: Review[]; pagination: { page: number; limit: number; totalItems: number; totalPages: number } }> {
    const MAX_LIMIT = 20;

    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException('page must be a positive integer');
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new BadRequestException('Invalid limit value');
    }
    if (limit > MAX_LIMIT) {
      throw new BadRequestException(`limit can't be bigger than ${MAX_LIMIT}`);
    }

    const places = await this.dataStorageService.readData('places') as Place[];
    const place = places.find(p => p.id === placeId);
    if (place === undefined) {
      throw new NotFoundException(`Place with id ${placeId} not found`);
    }

    let reviews = await this.dataStorageService.readData('reviews') as Review[];
    reviews = reviews.filter(review => review.placeId === placeId);

    const totalItems = reviews.length;
    const totalPages = Math.ceil(totalItems / limit);
    const start = (page - 1) * limit;
    const paginatedReviews = reviews.slice(start, start + limit);

    return {
      data: paginatedReviews,
      pagination: { page, limit, totalItems, totalPages },
    };
  }

  async findOne(id: string): Promise<Review> {
    const reviews = await this.dataStorageService.readData('reviews') as Review[];
    const reviewFound = reviews.find(review => review.id === id);
    if (reviewFound === undefined) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return reviewFound;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const reviews = await this.dataStorageService.readData('reviews') as Review[];
    for (let i = 0; i < reviews.length; i++) {
      if (reviews[i].id === id) {
        reviews[i] = { ...reviews[i], ...updateReviewDto, updatedAt: new Date() } as Review;
        await this.dataStorageService.writeData('reviews', reviews);
        await this.recalculatePlaceStats(reviews[i].placeId);
        return reviews[i];
      }
    }
    throw new NotFoundException(`Review with id ${id} not found`);
  }

  async remove(id: string): Promise<void> {
    const reviews = await this.dataStorageService.readData('reviews') as Review[];
    for (let i = 0; i < reviews.length; i++) {
      if (reviews[i].id === id) {
        const placeId = reviews[i].placeId;
        reviews.splice(i, 1);
        await this.dataStorageService.writeData('reviews', reviews);
        await this.recalculatePlaceStats(placeId);
        return;
      }
    }
    throw new NotFoundException(`Review with id ${id} not found`);
  }

  private async recalculatePlaceStats(placeId: string): Promise<void> {
    const places = await this.dataStorageService.readData('places') as Place[];
    const placeIndex = places.findIndex(p => p.id === placeId);
    if (placeIndex === -1) {
      return;
    }

    const reviews = await this.dataStorageService.readData('reviews') as Review[];
    const placeReviews = reviews.filter(review => review.placeId === placeId);

    const reviewCount = placeReviews.length;
    const averageRating = reviewCount === 0
      ? null
      : placeReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount;

    places[placeIndex].averageRating = averageRating;
    places[placeIndex].reviewCount = reviewCount;
    places[placeIndex].updatedAt = new Date();

    await this.dataStorageService.writeData('places', places);
  }
}