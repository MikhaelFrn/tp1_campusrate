import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PlacesModule } from './places/places.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';

@Module({
  imports: [PlacesModule, ReviewsModule, ConfigModule.forRoot({
    load: [configuration]
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
