import { MinionDna } from '../model/minion-dna';
import { Chance } from 'chance';

export class DnaMerger {
  private chance = new Chance();

  public async generateChild(
    dnaFather: MinionDna,
    dnaMother: MinionDna,
  ): Promise<MinionDna> {
    const rc = JSON.parse(JSON.stringify(dnaFather)) as MinionDna;

    if (this.chance.bool()) {
      rc.hairType = dnaMother.hairType;
    }
    if (this.chance.bool()) {
      rc.pocket = dnaMother.pocket;
    }
    if (this.chance.bool()) {
      rc.cloths = dnaMother.cloths;
    }
    if (this.chance.bool()) {
      rc.hairType = dnaMother.hairType;
    }
    if (this.chance.bool()) {
      rc.rightHandItem = dnaMother.rightHandItem;
    }
    if (this.chance.bool()) {
      rc.leftHandItem = dnaMother.leftHandItem;
    }
    if (this.chance.bool()) {
      rc.twoEyes = dnaMother.twoEyes;
      rc.eye = dnaMother.eye;
      rc.eyeRight = dnaMother.eyeRight;
      rc.eyeLeft = dnaMother.eyeLeft;
    }
    rc.mood = this.chance.integer({
      min: Math.min(dnaMother.mood, dnaFather.mood),
      max: Math.max(dnaMother.mood, dnaFather.mood),
    });
    console.log(dnaFather.mood);
    console.log(dnaMother.mood);
    console.log(rc.mood);
    console.log('');

    return rc;
  }
}
