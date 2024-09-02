import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from 'winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS para todas as origens
  app.enableCors();

  //  VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // SWAGGER
  const document = getSwagger(app);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(8080);
}
bootstrap();

function getSwagger(app: INestApplication<any>) {
  const config = getSwaggerConfig(version);
  const document = SwaggerModule.createDocument(app, config);

  document.info = {
    ...document.info,
    description: `${document.info.description}\nEnviroment: ${process.env.ENVIROMENT}`,
  };

  return document;
}

function getSwaggerConfig(version) {
  const config = new DocumentBuilder()
    .setTitle('Viceri Seidor API')
    .setDescription(getDescription())
    .setVersion(version)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' });

  const tags = ['login', 'task'];
  tags.forEach((tag) => config.addTag(tag));

  return config.build();
}

function getDescription() {
  return `aaaaa`;
}
