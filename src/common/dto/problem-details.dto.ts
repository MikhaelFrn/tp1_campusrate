import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

 export class ProblemDetailsDto {
      @ApiProperty({ example: 'about:blank' })
      type!: string;

      @ApiProperty({ example: 'Bad Request' })
      title!: string;

      @ApiProperty({ example: 400 })
      status!: number;

      @ApiProperty({
        example: 'The request contains invalid data.',
      })
      detail!: string;

      @ApiProperty({ example: '/api/v1/places/123e4567-e89b-12d3-a456-426614174000' })
      instance!: string;

      @ApiPropertyOptional({
        type: [String],
        example: ['The name is mandatory.'],
      })
      errors?: string[];
    }