import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { PlacesService } from './places.service.js';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import type { Response } from 'express';

@Controller('v1/places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createPlaceDto: CreatePlaceDto, @Res() res: Response) {
    const place = await this.placesService.create(createPlaceDto);
    res.setHeader('Location', `/v1/places/${place.id}`);
    res.status(HttpStatus.CREATED).json(place);
  }

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,    
    @Query('limit') limit?: string    
  ) {
    return this.placesService.findAll(category, status, page ? +page : undefined, limit ? +limit : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.placesService.remove(id);
  }
}
