import {Controller, Get, Header, Query, Res} from '@nestjs/common';
import {Readable} from 'stream';
import {EventEmitter} from 'events';
import {SvgManipulationService} from './services/svg-manipulation.service';
import {isNullOrUndefined} from 'util';
import {DnaController} from './dna.controller';

const sharp = require('sharp');

@Controller()
export class AppController {

    constructor() {
    }

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
                const buf = await sharp(Buffer.from(svg), {density: 500})
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
    }
}
