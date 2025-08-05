import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Shortener API')
    .setDescription(
      `
      ## URL Shortener API
      
      A comprehensive service for creating, managing, and tracking shortened URLs with the following features:
      
      **Core Functionality**:
      - 🔗 Create short URLs from long URLs
      - 👤 User-specific URL management (authenticated users)
      - 📊 Track click counts and access statistics
      - 🛠️ Update or delete existing short URLs
      
      **Authentication**:
      - 🔑 JWT Bearer Token for protected endpoints
      - 👥 Optional auth for public URL shortening
      `,
    )
    .setVersion('1.0')
    .addTag('APIs')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
