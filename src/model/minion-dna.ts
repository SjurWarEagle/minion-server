export class MinionDnaEye {
  color: number;
  pupilShift: number;
  irisRadius: number;
  eyeRadius: number;
}

export class MinionDna {
  public name = 'TODO';
  public twoEyes: boolean;
  public eyeLeft: MinionDnaEye;
  public eyeRight: MinionDnaEye;
  public eye: MinionDnaEye;
  public cloths: number;
  public pocket: boolean;
  public gloves: boolean;
  public shoes: boolean;
  public skinColor: number;
  public hairType: number;
  public leftHandItem: number;
  public rightHandItem: number;
  /**
   * The way the mouth is formed
   */
  public mood: number;
}
