import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors(); // Allows requests from any origin by default
  // For production, configure specific origins: app.enableCors({ origin: 'https://your-frontend-domain.com' });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
