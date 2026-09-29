import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { ReviewResponseDto, UpdateReviewDto } from './dto/update-review.dto.js';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller({ path: 'places/:placeId/reviews', version: '1' })
export class PlaceReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a review',
    description: 'Adds a review for the given place'
  })
  @ApiParam({
    name: 'placeId',
    description: 'the place uuid',
    type: 'string',
    format: 'uuid'
  })
  @ApiCreatedResponse({
    description: 'Review created.',
    type: ReviewResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid review data.'
  })
  @ApiNotFoundResponse({
    description: 'Place not found.'
  })
  create(@Param('placeId') placeId: string, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(placeId, createReviewDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'consult every review for a place',
    description: 'returns the list of reviews for a given place over an amount of pages proportional to the total amount of reviews and how many of them can be displayed per page'
  })
  @ApiParam({
    name: 'placeId',
    description: 'the place uuid',
    type: 'string',
    format: 'uuid'
  })
  @ApiQuery({
    name: 'page',
    description: 'the page number',
    required: false,
    type: 'number'
  })
  @ApiQuery({
    name: 'limit',
    description: 'the maximum amount of items per page',
    required: false,
    type: 'number'
  })
  @ApiOkResponse({
    description: 'Paginated list of reviews returned.',
    schema: {
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/ReviewResponseDto' } },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            totalItems: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid page or limit value.'
  })
  @ApiNotFoundResponse({
    description: 'Place not found.'
  })
  findAll(
    @Param('placeId') placeId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findAllForPlace(placeId, page ? +page : undefined, limit ? +limit : undefined);
  }
}
