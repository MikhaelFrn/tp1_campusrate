import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto.js';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
export class ReviewResponseDto {

    @ApiProperty({
        description: 'Review ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @ApiProperty({
        description: 'ID of the place this review is about',
        example: '789e4567-e89b-12d3-a456-426614174999',
    })
    placeId: string;

    @ApiProperty({
        description: "Review's rating",
        example: 4,
        minimum: 1,
        maximum: 5,
    })
    rating: number;

    @ApiProperty({
        description: "Review's comment",
        example: 'Great spot to study, but gets crowded around midterms.',
        maxLength: 500,
    })
    comment: string;

    @ApiProperty({
        description: 'Date when the review was created (ISO 8601)',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'Date when the review was last updated (ISO 8601)',
        example: '2023-01-02T00:00:00.000Z',
    })
    updatedAt: string;
}