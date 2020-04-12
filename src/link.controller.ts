import { Controller, Get, Header } from '@nestjs/common';
import { EventEmitter } from 'events';

@Controller()
export class LinkController {
  @Get('/link')
  @Header('Content-Type', 'text/html')
  public async getDna(): Promise<string> {
    // Event emitter only stops the program from terminating before the async function has been run
    const finishEventEmitter = new EventEmitter();
    finishEventEmitter.on('finish', () => {
      // process.exit();
    });

    return (
      '<html lang="en">' +
      '<body>' +
      '<img src=\'http://localhost:3000/render?width=20&height=20\' alt="minion"/>' +
      '' +
      '</html>'
    );
  }
}
