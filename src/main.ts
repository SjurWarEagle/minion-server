import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { mw } from 'request-ip';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(mw());
  await app.listen(3000);

  console.log('Examples:');
  console.log('\trender: http://127.0.0.1:3000/render');
  console.log('\trender: http://127.0.0.1:3000/render?width=200&height=200');
  console.log('\tdna:    http://127.0.0.1:3000/dna');
  console.log('\tpixel:  http://127.0.0.1:3000/html/index.html');
  console.log(
    '\tposter: http://127.0.0.1:3000/poster?x=10&y=5&width=200&height=200',
  );
}

bootstrap();
