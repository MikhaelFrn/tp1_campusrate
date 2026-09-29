    import { INestApplication } from '@nestjs/common';
    import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

    export function configureSwagger(app: INestApplication): void {
      const config = new DocumentBuilder()
        .setTitle('CampusRate API')
        .setDescription(
          'REST API made to let students view and rate places on campus',
        )
        .setVersion('1.0.0')
        .addTag('Places', 'Places available to students')
        .addTag('Reviews', 'Student reviews about different places')
        .build();

      const documentFactory = () =>
        SwaggerModule.createDocument(app, config);

      SwaggerModule.setup('docs', app, documentFactory, {
        jsonDocumentUrl: 'docs/openapi.json',
        customSiteTitle: 'CampusRate API - Documentation',
      });
    }