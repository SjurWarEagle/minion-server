import {
  Controller,
  Get,
  Header,
  PayloadTooLargeException,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { EventEmitter } from 'events';
import * as sharp from 'sharp';
import { Readable } from 'stream';
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
    @Request() request,
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

    console.log(
      `Poster with x=${minionWidthCnt}, y=${minionHeightCnt} and size of minion with height=${minionHeightPixel} width=${minionWidthPixel} requested by ${request.clientIp}.`,
    );

    this.validateParameters(minionWidthCnt, minionHeightCnt);

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
    return await sharp(Buffer.from(svg), { density: 500 })
      .resize(minionWidthPixel, minionHeightPixel, {
        fit: 'contain',
        kernel: 'mitchell',
      })
      .sharpen()
      .png()
      .toBuffer();
  }

  private validateParameters(
    minionWidthCnt: number,
    minionHeightCnt: number,
  ): void {
    if (minionWidthCnt > 20) {
      throw new PayloadTooLargeException('x > 20', 'x > 20');
    }

    if (minionHeightCnt > 20) {
      throw new PayloadTooLargeException('y > 20', 'y > 20');
    }
  }
}
