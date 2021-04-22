import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { mw } from 'request-ip';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Minions')
    .setDescription('The API for generating minions - description')
    .setVersion('1.0')
    .addTag('minions')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);

  app.use(mw());
  await app.listen(3000);

  console.log('Examples:');
  console.log('\tapi:              http://127.0.0.1:3000/api');
  console.log('\tHelp:             http://127.0.0.1:3000/help.html');
  console.log('\trender:           http://127.0.0.1:3000/renderType?width=800&height=800&type=1&text=Hallo');
  console.log('\trender:           http://127.0.0.1:3000/renderType?type=1');
  console.log('\trender:           http://127.0.0.1:3000/render');
  console.log('\trender:           http://127.0.0.1:3000/render?width=200&height=200');
  console.log('\trenderWithCookie: http://127.0.0.1:3000/renderRandomWithCookie?width=800&height=800');
  console.log('\tdna:              http://127.0.0.1:3000/dna');
  console.log('\tpixel:            http://127.0.0.1:3000/html/index.html');
  console.log('\tpixel:            http://127.0.0.1:3000/grid.html');
  console.log('\tpixel:            http://127.0.0.1:3000/renderDna?width=200&height=200&dna=%7B%2522name%2522%3A%2522Clyde%2520Jefferson%2522%2C%2522gloves%2522%3Afalse%2C%2522shoes%2522%3Atrue%2C%2522mood%2522%3A88%2C%2522skinColor%2522%3A60%2C%2522hairType%2522%3A1%2C%2522pocket%2522%3Afalse%2C%2522cloths%2522%3A2%2C%2522leftHandItem%2522%3A3%2C%2522rightHandItem%2522%3A1%2C%2522twoEyes%2522%3Atrue%2C%2522eyeLeft%2522%3A%7B%2522pupilShift%2522%3A5.9754%2C%2522irisRadius%2522%3A2.4775%2C%2522color%2522%3A9320832%2C%2522eyeRadius%2522%3A18.559%7D%2C%2522eyeRight%2522%3A%7B%2522pupilShift%2522%3A-5.9754%2C%2522irisRadius%2522%3A2.4775%2C%2522color%2522%3A9320832%2C%2522eyeRadius%2522%3A18.559%7D%2C%2522eye%2522%3A%7B%2522pupilShift%2522%3A5.9754%2C%2522irisRadius%2522%3A2.4775%2C%2522color%2522%3A9320832%2C%2522eyeRadius%2522%3A18.559%7D%2C%22speechText%22%3A%5B%22Line1%22%2C%20%22Line2%22%2C%20%22Line3%22%2C%20%22Line4%22%2C%20%22Line5%22%5D%7D');
  console.log('\tposter:           http://127.0.0.1:3000/poster?x=10&y=5&width=200&height=200');
}

bootstrap();
