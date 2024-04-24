import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    console.log(`App on port ${port}`);
  });
}
bootstrap();
