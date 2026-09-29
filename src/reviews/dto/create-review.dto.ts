import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReviewDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    @ApiProperty({
        description: "Review's rating",
        example: 4,
        minimum: 1,
        maximum: 5,
    })
    rating: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    @ApiProperty({
        description: "Review's comment",
        example: 'Great spot to study, but gets crowded around midterms.',
        maxLength: 500,
    })
    comment: string;
}