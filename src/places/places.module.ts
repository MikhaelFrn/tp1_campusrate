import { Module } from '@nestjs/common';
import { PlacesService } from './places.service.js';
import { PlacesController } from './places.controller.js';
import { DataStorageService } from '../data/data-storage.service.js';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, DataStorageService],
})
export class PlacesModule {}
