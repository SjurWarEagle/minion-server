import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { DnaController } from './controller/dna.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PosterController } from './controller/poster.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: __dirname + '/../src/assets/html',
    }),
  ],
  controllers: [
    AppController, //
    PosterController,
    DnaController,
  ],
  providers: [],
})
export class AppModule {}
