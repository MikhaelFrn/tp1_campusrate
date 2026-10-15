import { Controller, Get, Body, Patch, Param, Delete, Query, HttpCode } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { ReviewResponseDto, UpdateReviewDto } from './dto/update-review.dto.js';
import { ApiBadRequestResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller({ path: 'reviews', version: '1' })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Review returned.',
    type: ReviewResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'the review ObjectId',
    type: 'string',
    format: 'ObjectId'
  })
  @ApiNotFoundResponse({
    description: 'Review not found.'
  })
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    description: 'the review ObjectId',
    type: 'string',
    format: 'ObjectId'
  })
  @ApiOkResponse({
    description: 'Review updated.',
    type: ReviewResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Review not found.'
  })
  @ApiBadRequestResponse({
    description: 'Invalid review data'
  })
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiParam({
    name: 'id',
    description: 'the review ObjectId',
    type: 'string',
    format: 'ObjectId'
  })
  @ApiNoContentResponse({
    description: 'Review deleted.'
  })
  @ApiNotFoundResponse({
    description: 'Review not found.'
  })
  async remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}