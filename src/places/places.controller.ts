import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { PlacesService } from './places.service.js';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { PlaceResponseDto, UpdatePlaceDto } from './dto/update-place.dto.js';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('Places')
@Controller({path: 'places', version: '1'})
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a place',
    description: 'Adds a place to current general collection'
  })
  @ApiCreatedResponse({
    description: 'Place created.',
      type: PlaceResponseDto,
      headers: {
        Location: {
          description: 'new place URI',
          schema: { type: 'string' },
        },
      },
  })
  @ApiBadRequestResponse ({
    description: 'Invalid place data.'
  })
  async create(@Body() createPlaceDto: CreatePlaceDto, @Res() res: Response) {
    const place = await this.placesService.create(createPlaceDto);
    res.setHeader('Location', `/v1/places/${place.id}`);
    res.status(201).json(place);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'consult every place',
    description: 'returns the entire list of places over an amount of pages proportional to the total amount of buildings and how many of them can be displayed per page'
  })
  @ApiQuery({
    name: 'category',
    description: 'the building category',
    required: false,
    type: 'string'
  })
  @ApiQuery({
    name: 'status',
    description: 'the building status',
    required: false,
    type: 'string'
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
    description: 'Paginated list of places returned.',
    schema: {
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/PlaceResponseDto' } },
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
    description: 'Invalid category, status, page, or limit value.'
  })
  findAll(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,    
    @Query('limit') limit?: string    
  ) {
    return this.placesService.findAll(category, status, page ? +page : undefined, limit ? +limit : undefined);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Place returned.',
      type: PlaceResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'the place uuid',
    type: 'string',
    format: 'uuid'
  })
  @ApiNotFoundResponse({
     description: 'Place not found.' 
  })
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    description: 'the place uuid',
    type: 'string',
    format: 'uuid'
  })
  @ApiOkResponse({
    description: 'Place updated.',
      type: PlaceResponseDto,
  })
  @ApiNotFoundResponse({
     description: 'Place not found.' 
  })
  @ApiBadRequestResponse({
    description: 'Invalid place data'
  })
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiParam({
    name: 'id',
    description: 'the place uuid',
    type: 'string',
    format: 'uuid'
  })
  @ApiNoContentResponse({
    description: 'Place deleted.'
  })
  @ApiNotFoundResponse({
     description: 'Place not found.' 
  })
  @ApiConflictResponse({
    description: 'Place has existing reviews and cannot be deleted.'
  })
  remove(@Param('id') id: string) {
    return this.placesService.remove(id);
  }
}
