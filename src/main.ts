import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Don't worry, the library will automatically re-add the default body parsers.
    bodyParser: false,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  // app.enableCors({
  //   origin: [
  //     'http://localhost:8081', // Expo web dev server
  //     'http://localhost:19006', // Alternative Expo web port
  //     'exp://192.168.x.x:8081', // Your local network IP
  //     'exp://', // Trust all Expo URLs (prefix matching)
  //     'exp://**', // Trust all Expo URLs (wildcard matching)
  //     'exp://192.168.*.*:*/**',
  //     /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/,
  //   ],
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  // });
  const config = new DocumentBuilder()
    .setTitle('Password Manager API')
    .setDescription('The Password Manager API description')
    .setVersion('1.0')
    .addTag('password-manager')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/openapi', app, documentFactory);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
