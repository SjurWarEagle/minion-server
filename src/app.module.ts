import { Module } from '@nestjs/common';
import { DnaController } from './controller/dna.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PosterController } from './controller/poster.controller';
import { RenderController } from './controller/render.controller';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: __dirname + '/../src/assets/html',
    // }),
  ],
  controllers: [
    RenderController, //
    PosterController,
    DnaController,
  ],
  providers: [],
})
export class AppModule {}
