import { Controller, Get, Header } from '@nestjs/common';
import { MinionDna } from './model/minion-dna';
import { DnaRandomizerService } from './dna-randomizer.service';
import { DnaGenerationParameters } from './model/dna-generation-parameter';
import { EventEmitter } from 'events';

@Controller()
export class DnaController {
  @Get('/dna')
  @Header('Content-Type', 'application/json')
  public async getDna(): Promise<MinionDna> {
    const dnaRandomizerService = new DnaRandomizerService();

    // Event emitter only stops the program from terminating before the async function has been run
    const finishEventEmitter = new EventEmitter();
    finishEventEmitter.on('finish', () => {
      process.exit();
    });

    return dnaRandomizerService.generateMinion(new DnaGenerationParameters());
  }
}
