import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { PlacesService } from './places.service.js';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import type { Response } from 'express';

@Controller('v1/places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  async create(@Body() createPlaceDto: CreatePlaceDto, @Res() res: Response) {
    const place = await this.placesService.create(createPlaceDto);
    res.setHeader('Location', `/v1/places/${place.id}`);
    res.status(201).json(place);
  }

  @Get()
  @HttpCode(200)
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
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.placesService.remove(id);
  }
}
