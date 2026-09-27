import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ArrayUnique, MaxLength } from 'class-validator';
import { PlaceCategory } from '../../enums/place-category.enum.js';
import { PlaceStatus } from '../../enums/place-state.enum.js';
export class CreatePlaceDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @ApiProperty({ 
        description: 'Place name',
        example: 'Library',
        maxLength: 255,
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    @ApiProperty({
        description: "Place's description",
        example: 'The library is a quiet place for studying and reading.',
        maxLength: 500,
    })
    description: string;
    
    @IsNotEmpty()
    @IsEnum(PlaceCategory)
    @ApiProperty({
        description: "The place's category",
        example: PlaceCategory.STUDY_SPACE,
    })
    category: PlaceCategory;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @ApiProperty({
        description: "Place's address",
        example: '7000 Marie-Victorin',
        maxLength: 255,
    })
    address: string;

    @IsArray()
    @ArrayUnique()
    @IsString({ each: true })
    @IsOptional()
    @ApiProperty({
        description: 'List of services and equipement available at the place',
        example: ['WIFI', 'POWER_OUTLETS', 'WORKSTATIONS'],
    })
    services?: string[];

    @IsEnum(PlaceStatus)
    @IsOptional()
    @ApiProperty({
        description: "Place's status",
        example: PlaceStatus.ACTIVE,
    })
    status?: PlaceStatus;
}
