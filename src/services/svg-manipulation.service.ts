import { MinionDna, MinionDnaEye } from '../model/minion-dna';
import { readFileSync } from 'fs';
import * as chroma from 'chroma-js';
import { isNullOrUndefined } from 'util';

const DOMParser = new (require('xmldom').DOMParser)();

export class SvgManipulationService {
  public async applyDna(dna: MinionDna): Promise<string> {
    const xmlContent = await readFileSync(
      'src/assets/minions-svgrepo-com.svg',
    ).toLocaleString();
    const document = DOMParser.parseFromString(xmlContent);
    // const groupDoubleEyes = document.getElementById('groupDoubleEyes');
    // groupDoubleEyes.parentNode.removeChild(groupDoubleEyes);
    // minion original color: fce029
    const colorScale = chroma.scale(['FCE029', 'FFC120']).domain([0, 100]);
    const skinColor = colorScale(dna.skinColor).hex();

    this.speechRealign(dna);
    this.setSpeechText(document, dna);
    this.setSpeechBubbleSize(document, dna);

    this.setSkinColor(document, dna, skinColor);
    this.setCloth(document, dna);
    this.modifyEyes(document, dna);
    this.setPocket(document, dna);
    this.setHair(document, dna.hairType, dna.cloths);
    this.setMood(document, dna.mood);

    this.setItemInHands(document, 'leftHand', dna.leftHandItem);
    this.setItemInHands(document, 'rightHand', dna.rightHandItem);

    return document.toString();
  }

  private modifyEyes(document: Document, dna: MinionDna): void {
    //TODO use both eyes
    const color = '#' + dna.eye.color.toString(16);
    if (dna.twoEyes) {
      this.setStroke(document, 'doubleEyesPupilRight', color);
      this.setStroke(document, 'doubleEyesPupilLeft', color);

      this.setEyes(
        document.getElementById('eyeRight'),
        document.getElementById('eyeLeft'),
        dna.eyeRight,
        dna.eyeLeft,
      );
      // this.setPupilTwoEyes(this.svg.getElementById('doubleEyeLeftPupil'), dna.eyeLeft);
      // this.setPupilTwoEyes(this.svg.getElementById('doubleEyeRightPupil'), dna.eyeRight);

      this.remove(document, 'groupSingleEye');
    } else {
      this.setStroke(document, 'singleEyePupilIris', color);
      this.setEye(document.getElementById('eye'), dna.eyeRight);
      this.remove(document, 'groupDoubleEyes');
    }
  }

  private remove(document: Document, id: string) {
    const element = document.getElementById(id);
    if (!isNullOrUndefined(element)) {
      element.parentNode.removeChild(element);
    }
  }

  private setStroke(document: Document, id: string, fill: string): void {
    const element = document.getElementById(id);

    if (isNullOrUndefined(element)) {
      console.error(`Could not find element with id=${id}`);
      return;
    }
    element.setAttribute('style', `stroke:${fill};stroke-width: 0.2 `);
  }

  private setFill(document: Document, id: string, fill: string): void {
    const element = document.getElementById(id);

    if (isNullOrUndefined(element)) {
      console.error(`Could not find element with id=${id}`);
      return;
    }
    element.setAttribute('style', `fill:${fill}; `);
    // console.log('id',id);
    // console.log('element',element);
    // console.log('element',element.getAttribute('style'));
    // console.log('element.style',element.style);
    // const elementUpdated = document.getElementById(id);
    // console.log('elementUpdated',elementUpdated.style);
    // elementUpdated.style.fill = fill;
  }

  private setSkinColor(document: Document, dna: MinionDna, skinColor: string) {
    this.setFill(document, 'skinLegs', skinColor);
    this.setFill(document, 'skinHead', skinColor);
    this.setFill(document, 'skinArmRight', skinColor);
    this.setFill(document, 'skinArmLeft', skinColor);

    if (!dna.shoes) {
      this.setFill(document, 'shoeLeft', skinColor);
      this.setFill(document, 'shoeRight', skinColor);
    }

    if (!dna.gloves) {
      this.setFill(document, 'gloveLeft', skinColor);
      this.setFill(document, 'gloveRight', skinColor);
    }
  }

  private setEye(pupil, eye: MinionDnaEye): void {
    pupil.setAttribute('r', eye.eyeRadius.toString());
  }

  private setEyes(
    pupilLeft,
    pupilRight,
    leftEye: MinionDnaEye,
    rightEye: MinionDnaEye,
  ): void {
    pupilLeft.setAttribute('r', leftEye.eyeRadius.toString());
    pupilRight.setAttribute('r', rightEye.eyeRadius.toString());
  }

  private mapRange = (
    value: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): number => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

  // M96.324,126.494C116.404,144.705
  private setMood(document: Document, mood: number): void {
    const element = document.getElementById('mouth');
    //console.log('element', element);
    const d = element.getAttribute('d');
    //console.log('d', d);
    const dd = d ? d.split(' ') : [];
    //console.log('dd', dd);

    const entry = dd[0].split(',');
    //console.log('entry', entry);
    // console.log('mood', mood);
    entry[2] = this.mapRange(mood, -50, 100, 110, 155).toString();
    // console.log('entry[2]', entry[2]);
    //console.log('entry', entry);
    dd[0] = entry.join(',');
    // console.log('dd',dd);

    element.setAttribute('d', dd.join(' '));
  }

  private setHair(document: Document, hair: number, cloths: number): void {
    if (cloths === 4) {
      hair = 0;
    }

    switch (hair) {
      case 0:
        this.remove(document, 'hairSpiked');
        this.remove(document, 'hairSpikedShort');
        this.remove(document, 'hairSprout');
        this.remove(document, 'hairSleek');
        break;
      case 1:
        // this.svg.getElementById('hairSpiked').remove();
        this.remove(document, 'hairSpikedShort');
        this.remove(document, 'hairSprout');
        this.remove(document, 'hairSleek');
        break;
      case 2:
        this.remove(document, 'hairSpiked');
        // this.svg.getElementById('hairSpikedShort').remove();
        this.remove(document, 'hairSprout');
        this.remove(document, 'hairSleek');
        break;
      case 3:
        this.remove(document, 'hairSpiked');
        this.remove(document, 'hairSpikedShort');
        // this.svg.getElementById('hairSprout').remove();
        this.remove(document, 'hairSleek');
        break;
      case 4:
        this.remove(document, 'hairSpiked');
        this.remove(document, 'hairSpikedShort');
        this.remove(document, 'hairSprout');
        // this.svg.getElementById('hairSleek').remove();
        break;
      default:
        console.log(`Hair ${hair} unknown.`);
    }
  }

  private setPocket(document: Document, dna: MinionDna): void {
    if (dna.pocket) {
      this.remove(document, 'pocket');
    }
  }

  private setSpeechBubbleSize(document: Document, dna: MinionDna): void {
    if (this.isSpeechEmpty(dna.speechText)) {
      return;
    }

    let speechBubble = document.getElementById('speechBubble');
    let path = speechBubble.getAttribute('d');
    const shiftDown = (dna.speechText.length - 4) * 10;
    // left center
    path = path.replace(
      '4.993,28.117L4.993,61.634C4.993,69.3',
      '4.993,28.117L4.993,' +
        (61.6 + shiftDown) +
        'C4.993,' +
        (69.3 + shiftDown),
    );
    // right center
    path = path.replace('72.465,69.311', '72.465,' + (shiftDown + 69.3));
    path = path.replace(
      '72.465,61.634L72.465,28.117Z',
      '72.465,' + (61.6 + shiftDown) + 'L72.465,28.117Z',
    );
    // bottom
    path = path.split(',75.5').join(',' + (shiftDown + 75.5));
    speechBubble.setAttribute('d', path);
  }

  private speechRealign(dna: MinionDna): void {
    const maxLength = 26;
    const newTextBlock: string[] = [];
    dna.speechText.forEach((text) => {
      let newLine = '';
      text.split(' ').forEach((word) => {
        if (newLine.length + word.length < maxLength) {
          newLine += word;
          newLine += ' ';
        } else {
          newTextBlock.push(newLine);
          newLine = word + ' ';
        }
      });
      newTextBlock.push(newLine);
    });
    dna.speechText = newTextBlock;
  }

  private setSpeechText(document: Document, dna: MinionDna): void {
    if (this.isSpeechEmpty(dna.speechText)) {
      this.remove(document, 'speech');
    } else {
      for (let i = 0; i < dna.speechText.length; i++) {
        if (i === 0) {
          let element = document.getElementById('speechTextLine' + i);
          (element.lastChild as any).nodeValue = dna.speechText[i];
          (element.lastChild as any).data = dna.speechText[i];
        } else {
          let elementForCloning = document.getElementById('speechTextLine0');
          // console.log('i=' + i);
          // console.log('elementForCloning=' + elementForCloning);

          let element: HTMLElement = document.createElement('text');
          element.appendChild(document.createElement('text'));
          // let element: HTMLElement = Object.assign(
          //   document.createElement('text'),
          //   elementForCloning,
          // );

          // console.log(JSON.stringify(element));
          // console.log(JSON.stringify(elementForCloning));
          element.setAttribute('id', 'speechText' + i);
          element.setAttribute('y', 8 * i + 'px');
          element.setAttribute('x', elementForCloning.getAttribute('x'));
          element.setAttribute(
            'style',
            elementForCloning.getAttribute('style'),
          );
          // console.log('ele.x=' + element.getAttribute('x'));
          // console.log('ele.y=' + element.getAttribute('y'));
          (element as any).textContent = dna.speechText[i];
          elementForCloning.parentNode.appendChild(element);
        }
      }
      // ///todo do we need to remove empty containers?
      // //   element.parentNode.removeChild(element);
    }
  }

  private isSpeechEmpty(speechText: string[]): boolean {
    if (speechText === null || speechText === undefined) {
      return true;
    }
    if (speechText.length === 0) {
      return true;
    }
    let empty = true;
    for (let i = 0; i < speechText.length; i++) {
      if (!isNullOrUndefined(speechText[i]) && speechText[i] !== '') {
        // console.log('>' + speechText[i] + '<');
        empty = false;
      }
    }
    // console.log('empty:' + empty);
    return empty;
  }

  private setCloth(document: Document, dna: MinionDna): void {
    switch (dna.cloths) {
      case 0:
        this.remove(document, 'fancyDress');
        this.remove(document, 'workingCloth');
        this.remove(document, 'hawaii');
        this.remove(document, 'armor');
        break;
      case 1:
        this.remove(document, 'underwear');
        // document.getElementById('fancyDress').remove();
        this.remove(document, 'workingCloth');
        this.remove(document, 'hawaii');
        this.remove(document, 'armor');
        break;
      case 2:
        this.remove(document, 'underwear');
        this.remove(document, 'fancyDress');
        // document.getElementById('workingCloth').remove();
        this.remove(document, 'hawaii');
        this.remove(document, 'armor');
        break;
      case 3:
        this.remove(document, 'underwear');
        this.remove(document, 'fancyDress');
        this.remove(document, 'workingCloth');
        // document.getElementById('hawaii').remove();
        this.remove(document, 'armor');
        break;
      case 4:
        this.remove(document, 'underwear');
        this.remove(document, 'fancyDress');
        this.remove(document, 'workingCloth');
        this.remove(document, 'hawaii');
        // this.remove(document, 'armor');
        break;
      default:
        console.log(`cloth ${dna.cloths} unknown.`);
    }
  }

  private setItemInHands(document: Document, hand: string, itemInHand: number) {
    switch (itemInHand) {
      case 0:
        this.remove(document, `${hand}Banana`);
        this.remove(document, `${hand}Wrench`);
        this.remove(document, `${hand}Hammer`);
        this.remove(document, `${hand}Router`);
        this.remove(document, `${hand}Teddy`);
        this.remove(document, `${hand}Lollie`);
        this.remove(document, `${hand}Sign`);
        break;
      case 1:
        // this.svg.getElementById(`${hand}Banana`).remove();
        this.remove(document, `${hand}Wrench`);
        this.remove(document, `${hand}Hammer`);
        this.remove(document, `${hand}Router`);
        this.remove(document, `${hand}Teddy`);
        this.remove(document, `${hand}Lollie`);
        this.remove(document, `${hand}Sign`);
        break;
      case 2:
        this.remove(document, `${hand}Banana`);
        // this.svg.getElementById(`${hand}Wrench`).remove();
        this.remove(document, `${hand}Hammer`);
        this.remove(document, `${hand}Router`);
        this.remove(document, `${hand}Teddy`);
        this.remove(document, `${hand}Lollie`);
        this.remove(document, `${hand}Sign`);
        break;
      case 3:
        this.remove(document, `${hand}Banana`);
        this.remove(document, `${hand}Wrench`);
        // this.svg.getElementById(`${hand}Hammer`).remove();
        this.remove(document, `${hand}Router`);
        this.remove(document, `${hand}Teddy`);
        this.remove(document, `${hand}Lollie`);
        this.remove(document, `${hand}Sign`);
        break;
      case 4:
        this.remove(document, `${hand}Banana`);
        this.remove(document, `${hand}Wrench`);
        this.remove(document, `${hand}Hammer`);
        // this.svg.getElementById(`${hand}Router`).remove();
        this.remove(document, `${hand}Teddy`);
        this.remove(document, `${hand}Lollie`);
        this.remove(document, `${hand}Sign`);
        break;
      case 5:
        this.remove(document, `${hand}Banana`);
        this.remove(document, `${hand}Wrench`);
        this.remove(document, `${hand}Hammer`);
        this.remove(document, `${hand}Router`);
        // this.svg.getElementById(`${hand}Teddy`).remove();
        this.remove(document, `${hand}Lollie`);
        this.remove(document, `${hand}Sign`);
        break;
      case 6:
        this.remove(document, `${hand}Banana`);
        this.remove(document, `${hand}Wrench`);
        this.remove(document, `${hand}Hammer`);
        this.remove(document, `${hand}Router`);
        this.remove(document, `${hand}Teddy`);
        // this.svg.getElementById(`${hand}Lollie`).remove();
        this.remove(document, `${hand}Sign`);
        break;
      case 7:
        this.remove(document, `${hand}Banana`);
        this.remove(document, `${hand}Wrench`);
        this.remove(document, `${hand}Hammer`);
        this.remove(document, `${hand}Router`);
        this.remove(document, `${hand}Teddy`);
        this.remove(document, `${hand}Lollie`);
        // this.svg.getElementById(`${hand}Sign`).remove();
        break;
    }
  }
}
