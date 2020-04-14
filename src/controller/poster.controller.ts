import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { EventEmitter } from 'events';
const sharp = require('sharp');
import { Readable } from 'stream';
import { AppController } from './app.controller';
import { SvgManipulationService } from '../services/svg-manipulation.service';
import { DnaRandomizerService } from '../services/dna-randomizer.service';

@Controller()
export class PosterController {
  @Get('/poster')
  @Header('Content-Type', 'image/png')
  public async getPoster(
    @Query('width') width: string,
    @Query('height') height: string,
    @Query('x') x: string,
    @Query('y') y: string,
    @Res() res,
  ): Promise<any> {
    // Event emitter only stops the program from terminating before the async function has been run
    const finishEventEmitter = new EventEmitter();
    finishEventEmitter.on('finish', () => {
      // process.exit();
    });

    const minionWidthPixel = parseInt(width, 10);
    const minionHeightPixel = parseInt(height, 10);
    const minionWidthCnt = parseInt(x, 10);
    const minionHeightCnt = parseInt(y, 10);

    const svgManipulationService = new SvgManipulationService();

    const compositeParameter = [];
    for (let x = 0; x < minionWidthCnt; x++) {
      for (let y = 0; y < minionHeightCnt; y++) {
        // console.log(x * minionWidthCnt + y);
        const svg = await svgManipulationService.applyDna(
          await new DnaRandomizerService().generateMinion(undefined),
        );
        compositeParameter.push({
          input: await this.generateMinionImage(
            svg,
            minionWidthPixel,
            minionHeightPixel,
          ),
          blend: 'over',
          top: y * minionHeightPixel,
          left: x * minionWidthPixel,
        });
      }
    }

    // console.log(compositeParameter);
    // sharp.cache(false);
    const buf = await sharp({
      create: {
        width: minionWidthPixel * minionWidthCnt,
        height: minionHeightPixel * minionHeightCnt,
        channels: 4,
        background: { r: 100, g: 100, b: 100 },
      },
    })
      .ensureAlpha()
      .composite(compositeParameter)
      .png()
      .toBuffer();

    const stream = new Readable();
    stream.push(buf);
    stream.push(null);

    try {
      return stream.pipe(res);
    } catch (err) {
      console.error(err);
    } finally {
      finishEventEmitter.emit('finish');
    }
  }

  private async generateMinionImage(
    svg: string,
    minionWidthPixel: number,
    minionHeightPixel: number,
  ): Promise<Buffer> {
    const buffer = await sharp(Buffer.from(svg), { density: 500 })
      .resize(minionWidthPixel, minionHeightPixel, {
        fit: 'contain',
        kernel: 'mitchell',
      })
      .sharpen()
      .png()
      .toBuffer();

    return buffer;
  }
}
