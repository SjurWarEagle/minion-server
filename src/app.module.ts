import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DnaController } from './dna.controller';
import { LinkController } from './link.controller';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: __dirname + '/../src/assets/html',
    }),
  ],
  controllers: [
    AppController, //
    LinkController,
    DnaController,
  ],
  providers: [],
})
export class AppModule {}
