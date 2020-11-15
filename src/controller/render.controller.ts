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
import { SvgManipulationService } from '../services/svg-manipulation.service';
import { isNullOrUndefined } from 'util';
import { DnaController } from './dna.controller';
import { MinionDna } from '../model/minion-dna';
import * as sharp from 'sharp';
// import * as request from 'request-promise';
const request = require('request-promise');

@Controller()
export class RenderController {
  @Get('/render/')
  @Get('/renderRandom/')
  @Header('Content-Type', 'image/png')
  async getRenderedMinion(
    @Query('width') width: string,
    @Query('height') height: string,
    @Query('text') text: string,
    @Res() res,
  ): Promise<any> {
    const myWidth = !isNullOrUndefined(width) ? Number.parseInt(width) : 500;
    const myHeight = !isNullOrUndefined(height) ? Number.parseInt(height) : 500;
    const dna = await new DnaController().getDna();
    if (!isNullOrUndefined(text)) {
      dna.speechText = [];
      dna.speechText.push(text);
    }
    return this.getRenderedMinionWithSize(myWidth, myHeight, dna, res);
  }

  @Get('/renderRandomWithCookie/')
  @Header('Content-Type', 'image/png')
  async getRenderedMinionWithCookie(
    @Query('width') width: string,
    @Query('height') height: string,
    @Res() res,
  ): Promise<any> {
    const myWidth = !isNullOrUndefined(width) ? Number.parseInt(width) : 500;
    const myHeight = !isNullOrUndefined(height) ? Number.parseInt(height) : 500;
    const dna = await new DnaController().getDna();

    let text = '';

    while (text.length < 30 || text.length > 200) {
      text = JSON.parse(await request('http://yerkee.com/api/fortune/wisdom'))
        .fortune;
    }

    // console.log('text', text);
    if (!isNullOrUndefined(text)) {
      dna.speechText = [];
      dna.speechText.push(text);
    }
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
    const dna = body as MinionDna;
    return this.getRenderedMinionWithSize(myWidth, myHeight, dna, res);
  }

  @Get('/renderDna/')
  @Header('Content-Type', 'image/png')
  async getRenderedMinionFromDna2(
    @Query('width') width: string,
    @Query('height') height: string,
    @Query('dna') dnaString: string,
    @Body() body,
    @Res() res,
  ): Promise<any> {
    const myWidth = !isNullOrUndefined(width) ? Number.parseInt(width) : 500;
    const myHeight = !isNullOrUndefined(height) ? Number.parseInt(height) : 500;
    // TODO add some checks, that this really is a MinionDna
    //console.log('dnaString', decodeURI(dnaString));
    const dna = JSON.parse(decodeURI(dnaString)) as MinionDna;
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

    async function run(): Promise<void> {
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
