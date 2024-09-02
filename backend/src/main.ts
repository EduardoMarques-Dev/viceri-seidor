import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS para todas as origens
  app.enableCors();

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuração do Swagger
  const document = getSwagger(app);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(8080);
}
bootstrap();

function getSwagger(app: INestApplication) {
  const config = getSwaggerConfig(process.env.VERSION || '1.0.0');
  const document = SwaggerModule.createDocument(app, config);

  document.info = {
    ...document.info,
    description: `${document.info.description}\nEnvironment: ${
      process.env.ENVIROMENT || 'development'
    }`,
  };

  return document;
}

function getSwaggerConfig(version: string) {
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
  return `Esta é a API da Viceri Seidor, usada para gerenciar tarefas e autenticação.`;
}
