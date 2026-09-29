import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto.js';
import { UpdatePlaceDto } from './dto/update-place.dto.js';
import { DataStorageService } from '../data/data-storage.service.js';
import { Place } from './entities/place.entity.js';
import { PlaceStatus } from '../enums/place-state.enum.js';
import { PlaceCategory } from '../enums/place-category.enum.js';

@Injectable()
export class PlacesService {
  constructor(private readonly dataStorageService: DataStorageService) {}

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    createPlaceDto.name = createPlaceDto.name.trim();
    createPlaceDto.description = createPlaceDto.description.trim();
    createPlaceDto.address = createPlaceDto.address.trim();
    createPlaceDto.services = createPlaceDto.services?.map(service => service.trim());
    createPlaceDto.services = createPlaceDto.services ?? [];
    createPlaceDto.status = createPlaceDto.status ?? PlaceStatus.ACTIVE;

    const placeCreated = new Place(
      createPlaceDto.name,
      createPlaceDto.description,
      createPlaceDto.category,
      createPlaceDto.address,
      createPlaceDto.services,
      createPlaceDto.status
    )

    const places = await this.dataStorageService.readData('places') as Place[];
    places.push(placeCreated);
    await this.dataStorageService.writeData('places', places);
    return placeCreated;
  }

  async findAll(category?: string, status?: string, page = 1, limit = 10): Promise<{ data: Place[]; pagination: { page: number; limit: number; totalItems: number; totalPages: number } }> {
    const MAX_LIMIT = 20;
    let places = await this.dataStorageService.readData('places') as Place[];
    
    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException('page must be a positive integer');
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new BadRequestException("Invalid limit value")
    }
    if (limit > MAX_LIMIT) {
      throw new BadRequestException(`limit can't be bigger than ${MAX_LIMIT}`);
    }
    if (category !== undefined && !Object.values(PlaceCategory).includes(category as PlaceCategory)) {
      throw new BadRequestException(`Invalid category: ${category}`);
    }
    if (status !== undefined && !Object.values(PlaceStatus).includes(status as PlaceStatus)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    if (category !== undefined) {
      places = places.filter(place => place.category === category);
    }
    if (status !== undefined) {
      places = places.filter(place => place.status === status);
    }

    const totalItems = places.length;
    const totalPages = Math.ceil(totalItems / limit);
    const start = (page - 1) * limit;
    places = places.slice(start, start + limit);
    return {
      data: places,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async findOne(id: string): Promise<Place> {
    const places = await this.dataStorageService.readData('places') as Place[];
    const placeFound = places.find(place => place.id === id);
    if (placeFound === undefined) {
      throw new NotFoundException(`Place with id ${id} not found`);      
    }
    return placeFound;
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const places = await this.dataStorageService.readData('places') as Place[];
    for (let i = 0; i < places.length; i++) {
      if (places[i].id === id) {
        //copies the existing place and adds the updated field data, then updates the updatedAt date https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        places[i] = { ...places[i], ...updatePlaceDto, updatedAt: new Date() };
        await this.dataStorageService.writeData('places', places);
        return places[i];
      }
    }
    throw new NotFoundException(`Place with id ${id} not found`);
  }

  async remove(id: string): Promise<void> {
    const places = await this.dataStorageService.readData('places') as Place[];
    for (let i = 0; i < places.length; i++) {
      if (places[i].id === id) {
        if (places[i].reviewCount > 0) {
          throw new ConflictException(`Place with id ${id} cannot be deleted because it has reviews`);
        }
        places.splice(i, 1);
        await this.dataStorageService.writeData('places', places);
        return;
      }
    }
    throw new NotFoundException(`Place with id ${id} not found`);
  }
}
