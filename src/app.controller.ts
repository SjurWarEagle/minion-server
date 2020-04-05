import {Controller, Get, Header, Res} from '@nestjs/common';
import {createReadStream} from 'fs';
import {MinionDna} from "./model/minion-dna";
import {DnaRandomizerService} from "./dna-randomizer.service";
import {DnaGenerationParameters} from "./model/dna-generation-parameter";
import {EventEmitter} from "events";
import {v4} from "uuid";
import {SvgManipulationService} from "./services/svg-manipulation.service";
const sharp = require('sharp');


@Controller()
export class AppController {
    constructor() {
    }

    @Get('/dna')
    @Header('Content-Type', 'application/json')
    async getDna(): Promise<MinionDna> {
        const dnaRandomizerService = new DnaRandomizerService();

        // Event emitter only stops the program from terminating before the async function has been run
        const finishEventEmitter = new EventEmitter();
        finishEventEmitter.on('finish', () => {
            process.exit()
        });

        return dnaRandomizerService.generateMinion(new DnaGenerationParameters());
    }

    @Get('/render')
    @Header('Content-Type', 'image/png')
    async getRenderedMinion(@Res() res): Promise<any> {

        const outputFile = 'tmp/out-' + v4() + '.png';

        // Event emitter only stops the program from terminating before the async function has been run
        const finishEventEmitter = new EventEmitter();
        finishEventEmitter.on('finish', () => {
            // process.exit()
        });

        let svgManipulationService = new SvgManipulationService();
        const svg= await svgManipulationService.applyDna(await this.getDna());

        return run();

        async function run() {
            try {
                await sharp(
                    Buffer.from(svg),
                    {density: 500},
                )
                    .resize(512, 512, {
                        fit: 'contain',
                    })
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
