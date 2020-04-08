import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { createReadStream, mkdirSync } from 'fs';
import { EventEmitter } from 'events';
import { v4 } from 'uuid';
import { SvgManipulationService } from './services/svg-manipulation.service';
import { isNullOrUndefined } from 'util';
import { DnaController } from './dna.controller';

const sharp = require('sharp');

@Controller()
export class AppController {
  constructor() {}

  @Get('/render/')
  @Header('Content-Type', 'image/png')
  async getRenderedMinion(
    @Query('width') width: string,
    @Query('height') height: string,
    @Res() res,
  ): Promise<any> {
    const myWidth = !isNullOrUndefined(width) ? Number.parseInt(width) : 500;
    const myHeight = !isNullOrUndefined(height) ? Number.parseInt(height) : 500;
    return this.getRenderedMinionWithSize(myWidth, myHeight, res);
  }

  private async getRenderedMinionWithSize(
    width: number,
    height: number,
    @Res() res,
  ): Promise<any> {
    mkdirSync('tmp', { recursive: true });
    const outputFile = 'tmp/out-' + v4() + '.png';

    // Event emitter only stops the program from terminating before the async function has been run
    const finishEventEmitter = new EventEmitter();
    finishEventEmitter.on('finish', () => {
      // process.exit()
    });

    let svgManipulationService = new SvgManipulationService();
    const svg = await svgManipulationService.applyDna(
      await new DnaController().getDna(),
    );

    return run();

    async function run() {
      try {
        await sharp(Buffer.from(svg), { density: 500 })
          .resize(width, height, {
            fit: 'contain',
            kernel: 'mitchell',
          })
          .sharpen()
          .png()
          .toFile(outputFile);
        const data = createReadStream(outputFile);
        return data.pipe(res);
      } catch (err) {
        console.error(err);
      } finally {
        finishEventEmitter.emit('finish');
      }
    }
  }
}
