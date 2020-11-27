import { Chance } from 'chance';
import * as chroma from 'chroma-js';
import { MinionDna } from '../model/minion-dna';
import { DnaGenerationParameters } from '../model/dna-generation-parameter';
import { DnaMerger } from './dna-merger';
import { Cloths } from '../model/cloths';

/**
 * Generates the DNA for a minion by random values.
 * The values are within a reasonable range,
 * so that e.g. the eyes are not overlapping and such,
 * but the outcome is random.
 */
export class DnaRandomizerService {
  private chance = new Chance();

  private getItemInHandHand(): number {
    return this.chance.weighted(
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      [60, 10, 10, 10, 2, 2, 2, 2, 5],
    );
  }

  private generateCloth(dna: MinionDna): void {
    const rnd: Cloths = this.chance.weighted(
      [
        Cloths.UNDERWEAR,
        Cloths.DRESS,
        Cloths.WORKER,
        Cloths.HAWAII,
        Cloths.KNIGHT,
        Cloths.BATMAN,
        Cloths.COOK,
      ],
      [2, 2, 90, 2, 2, 2, 2],
    );
    dna.pocket = false;

    if (rnd === 2) {
      dna.pocket = this.chance.bool({ likelihood: 50 });
    }
    dna.cloths = rnd;
  }

  public async generateMinion(
    dnaGenerationParameters?: DnaGenerationParameters,
  ): Promise<MinionDna> {
    const dna = new MinionDna();
    dna.name = this.chance.name();

    dna.gloves = this.chance.bool({ likelihood: 80 });
    dna.shoes = this.chance.bool({ likelihood: 80 });
    //TODO think about changing this, the minions are happy person, they should have mostly a positve value,
    // but on the other side we need the low negative numbers, so that the mouth is changing visibly. Idea would be
    // to multiply the value with something, eg. if <0 value*5
    dna.mood = this.chance.integer({ min: -75, max: 100 });
    dna.skinColor = this.chance.integer({ min: 0, max: 100 });
    dna.hairType = this.chance.integer({ min: 0, max: 4 });

    this.generateCloth(dna);
    let holdsSameItem = true;
    let signAndItem = true;
    while (holdsSameItem || signAndItem) {
      dna.leftHandItem = this.getItemInHandHand();
      dna.rightHandItem = this.getItemInHandHand();
      //prevent having the same item in both hands, it happened too often because chance.js has a bad random generator
      holdsSameItem =
        dna.leftHandItem === dna.rightHandItem &&
        dna.leftHandItem !== 0 &&
        dna.rightHandItem !== 0;
      //prevent item and sign, as item then is not visible
      signAndItem =
        (dna.leftHandItem === 7 && dna.rightHandItem !== 0) ||
        (dna.leftHandItem !== 0 && dna.rightHandItem === 7);
    }

    dna.twoEyes = this.chance.bool({ likelihood: 80 });

    const irisRadius = this.chance.floating({ min: 2, max: 5 });
    const eyeRadius = this.chance.floating({ min: 15, max: 22 });
    const irisShift = this.chance.floating({ min: 0, max: 6 });

    //grayscale pupils, color ones looked strange
    // maybe add them later with a low chance
    let color = 0xffffff;
    while (chroma(color).luminance() > 0.25) {
      if (
        dnaGenerationParameters &&
        dnaGenerationParameters.allowColoredEyes &&
        this.chance.bool({ likelihood: 100 })
      ) {
        color = chroma.random().num();
      } else {
        color = chroma.random().desaturate(255).num();
      }
      // console.log(chroma(color).luminance());
      // console.log('color',color);
    }

    dna.eyeLeft = {
      pupilShift: irisShift,
      irisRadius: irisRadius,
      color: Math.floor(color),
      eyeRadius: eyeRadius,
    };

    dna.eyeRight = {
      pupilShift: -irisShift,
      irisRadius: irisRadius,
      color: Math.floor(color),
      eyeRadius: eyeRadius,
    };

    dna.eye = {
      pupilShift: irisShift,
      irisRadius: irisRadius,
      color: Math.floor(color),
      eyeRadius: eyeRadius,
    };

    return dna;
  }

  public async generateChild(
    dnaFather: MinionDna,
    dnaMother: MinionDna,
  ): Promise<MinionDna> {
    return new DnaMerger().generateChild(dnaFather, dnaMother);
  }
}
