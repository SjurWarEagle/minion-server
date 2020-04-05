import { MinionDna } from './minion-dna';

export class FamilyTree {
  public male: MinionDna;
  public female: MinionDna;
  public children: FamilyTree[] = [];
}
