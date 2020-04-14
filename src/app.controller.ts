import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Readable } from 'stream';
import { EventEmitter } from 'events';
import { SvgManipulationService } from './services/svg-manipulation.service';
import { isNullOrUndefined } from 'util';
import { DnaController } from './dna.controller';
import { MinionDna } from './model/minion-dna';

const sharp = require('sharp');

@Controller()
export class AppController {
  @Get('/render/')
  @Get('/renderRandom/')
  @Header('Content-Type', 'image/png')
  async getRenderedMinion(
    @Query('width') width: string,
    @Query('height') height: string,
    @Res() res,
  ): Promise<any> {
    const myWidth = !isNullOrUndefined(width) ? Number.parseInt(width) : 500;
    const myHeight = !isNullOrUndefined(height) ? Number.parseInt(height) : 500;
    let dna = await new DnaController().getDna();
    return this.getRenderedMinionWithSize(myWidth, myHeight, dna, res);
  }

  @Post('/renderDna/')
  @Header('Content-Type', 'image/png')
  async getRenderedMinionFromDna(
    @Query('width') width: string,
    @Query('height') height: string,
    @Body() body,
    @Res() res,
  ): Promise<any> {
    const myWidth = !isNullOrUndefined(width) ? Number.parseInt(width) : 500;
    const myHeight = !isNullOrUndefined(height) ? Number.parseInt(height) : 500;
    //TODO add some checks, that this really is a MinionDna
    let dna = body as MinionDna;
    return this.getRenderedMinionWithSize(myWidth, myHeight, dna, res);
  }

  private async getRenderedMinionWithSize(
    width: number,
    height: number,
    dna: MinionDna,
    @Res() res,
  ): Promise<any> {
    // Event emitter only stops the program from terminating before the async function has been run
    const finishEventEmitter = new EventEmitter();
    finishEventEmitter.on('finish', () => {
      // process.exit()
    });

    const svgManipulationService = new SvgManipulationService();
    const svg = await svgManipulationService.applyDna(dna);

    async function run() {
      try {
        const buf = await sharp(Buffer.from(svg), { density: 500 })
          .resize(width, height, {
            fit: 'contain',
            kernel: 'mitchell',
          })
          .sharpen()
          .png()
          .toBuffer();

        const stream = new Readable();
        stream.push(buf);
        stream.push(null);

        return stream.pipe(res);
      } catch (err) {
        console.error(err);
      } finally {
        finishEventEmitter.emit('finish');
      }
    }

    return run();
  }
}
