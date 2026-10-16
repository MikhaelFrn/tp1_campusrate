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

      @ApiProperty({ example: '/api/v1/places/6ad07bb40ae4c8652251d4c5' })
      instance!: string;

      @ApiPropertyOptional({
        type: [String],
        example: ['The name is mandatory.'],
      })
      errors?: string[];
    }