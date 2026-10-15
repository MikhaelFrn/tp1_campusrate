import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PlacesModule } from './places/places.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';
import configuration from './config/configuration.js';

@Module({
  imports: [PlacesModule, ReviewsModule, 
    ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    validationSchema:Joi.object({
      MONGO_URI: Joi.string().required(),
      PORT: Joi.number().default(3000),
    }),
  }),

  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({  
        uri: configService.get<string>('database.uri'),
        autoIndex: process.env.NODE_ENV !== 'production',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
