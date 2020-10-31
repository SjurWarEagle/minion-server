import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { MinionDna } from '../model/minion-dna';
import { DnaRandomizerService } from '../services/dna-randomizer.service';
import { DnaGenerationParameters } from '../model/dna-generation-parameter';
import { EventEmitter } from 'events';

@Controller()
export class DnaController {
  @Get('/dna')
  @Header('Content-Type', 'application/json')
  @Header('Pragma', 'no-cache')
  @Header('Surrogate-Control', 'no-store')
  @Header('Expires', '0')
  @Header(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  )
  public async getDna(): Promise<MinionDna> {
    const dnaRandomizerService = new DnaRandomizerService();

    // Event emitter only stops the program from terminating before the async function has been run
    const finishEventEmitter = new EventEmitter();
    finishEventEmitter.on('finish', () => {
      process.exit();
    });

    return dnaRandomizerService.generateMinion(new DnaGenerationParameters());
  }

  @Post('/child')
  @Header('Content-Type', 'application/json')
  @Header('Pragma', 'no-cache')
  @Header('Surrogate-Control', 'no-store')
  @Header('Expires', '0')
  @Header(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  )
  public async getChild(@Body() body): Promise<MinionDna> {
    const dnaRandomizerService = new DnaRandomizerService();

    const dnaFather = JSON.parse(decodeURI(body.dnaFather));
    const dnaMother = JSON.parse(decodeURI(body.dnaMother));

    // // Event emitter only stops the program from terminating before the async function has been run
    // const finishEventEmitter = new EventEmitter();
    // finishEventEmitter.on('finish', () => {
    //   process.exit();
    // });

    return dnaRandomizerService.generateChild(dnaFather, dnaMother);
  }
}
