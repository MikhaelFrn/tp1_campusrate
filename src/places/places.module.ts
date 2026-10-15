import { Module } from '@nestjs/common';
import { PlacesService } from './places.service.js';
import { PlacesController } from './places.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from './schema/place.schema.js';
import { PlaceRepository } from './place.repository.js';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
  ],
  controllers: [PlacesController],
  providers: [PlacesService, PlaceRepository],
})
export class PlacesModule {}
