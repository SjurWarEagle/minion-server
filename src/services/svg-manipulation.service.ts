import {MinionDna, MinionDnaEye} from "../model/minion-dna";
import {readFileSync} from "fs";
import * as chroma from 'chroma-js';
import {isNullOrUndefined} from "util";
const DOMParser = new (require('xmldom')).DOMParser;

export class SvgManipulationService {

    public async applyDna(dna: MinionDna): Promise<string> {
        let xmlContent = await readFileSync('src/assets/minions-svgrepo-com.svg').toLocaleString();
        const document = DOMParser.parseFromString(xmlContent);
        // const groupDoubleEyes = document.getElementById('groupDoubleEyes');
        // groupDoubleEyes.parentNode.removeChild(groupDoubleEyes);
        // minion original color: fce029
        const colorScale = chroma.scale(['FCE029', 'FFC120']).domain([0, 100]);
        const skinColor = colorScale(dna.skinColor).hex();

        this.setSkinColor(document, dna, skinColor);
        this.setCloth(document, dna)
        this.modifyEyes(document, dna)
        this.setHair(document, dna.hairType)

        this.setItemInHands(document, 'leftHand', dna.leftHandItem);
        this.setItemInHands(document, 'rightHand', dna.rightHandItem);

        return document.toString();
    }

    private modifyEyes(document:Document, dna:MinionDna): void {
        if (dna.twoEyes) {
            //TODO use both eyes
            const color = '#' + dna.eye.color.toString(16);
            // this.remove(document, 'doubleEyesPupilRight').style = `fill:${color} ;stroke:${color} ;stroke-width:0.04412191`;
            // this.remove(document, 'doubleEyesPupilLeft').style = `fill:${color} ;stroke:${color} ;stroke-width:0.04412191`;

            this.setEyes(
                document.getElementById('eyeRight'),
                document.getElementById('eyeLeft'),
                dna.eyeRight,
                dna.eyeLeft
            );
            // this.setPupilTwoEyes(this.svg.getElementById('doubleEyeLeftPupil'), dna.eyeLeft);
            // this.setPupilTwoEyes(this.svg.getElementById('doubleEyeRightPupil'), dna.eyeRight);

            this.remove(document, 'groupSingleEye');
        } else {
            const color = '#' + dna.eye.color.toString(16);
            // document.getElementById('singleEyePupilIris').style = `fill:${color} ;stroke:${color} ;stroke-width:0.04412191`;
            this.setEye(document.getElementById('eye'), dna.eyeRight);
            this.remove(document, 'groupDoubleEyes');
        }
    }
    private remove(document:Document, id: string) {
        const element = document.getElementById(id);
        if (!isNullOrUndefined(element)){
            element.parentNode.removeChild(element);
        }
    }

    private setFill(document:Document, id: string, fill: string) {
        const element = document.getElementById(id);

        element.setAttribute('style', `fill:${fill}; `);
        // console.log('id',id);
        // console.log('element',element);
        // console.log('element',element.getAttribute('style'));
        // console.log('element.style',element.style);
        // const elementUpdated = document.getElementById(id);
        // console.log('elementUpdated',elementUpdated.style);
        // elementUpdated.style.fill = fill;
    }

    private setSkinColor(document:Document, dna: MinionDna, skinColor: string) {
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

    private setEyes(pupilLeft, pupilRight, leftEye: MinionDnaEye, rightEye: MinionDnaEye): void {
        pupilLeft.setAttribute('r', leftEye.eyeRadius.toString());
        pupilRight.setAttribute('r', rightEye.eyeRadius.toString());
    }

    private setHair(document:Document,hair: number): void {
        switch (hair) {
            case 0:
                this.remove(document, 'hairSpiked');
                this.remove(document,'hairSpikedShort');
                this.remove(document,'hairSprout');
                this.remove(document,'hairSleek');
                break;
            case 1:
                // this.svg.getElementById('hairSpiked').remove();
                this.remove(document,'hairSpikedShort');
                this.remove(document,'hairSprout');
                this.remove(document,'hairSleek');
                break;
            case 2:
                this.remove(document,'hairSpiked');
                // this.svg.getElementById('hairSpikedShort').remove();
                this.remove(document,'hairSprout');
                this.remove(document,'hairSleek');
                break;
            case 3:
                this.remove(document,'hairSpiked');
                this.remove(document,'hairSpikedShort');
                // this.svg.getElementById('hairSprout').remove();
                this.remove(document,'hairSleek');
                break;
            case 4:
                this.remove(document,'hairSpiked');
                this.remove(document,'hairSpikedShort');
                this.remove(document,'hairSprout');
                // this.svg.getElementById('hairSleek').remove();
                break;
            default:
                console.log(`Hair ${hair} unknown.`);
        }
    }

    private setCloth(document:Document, dna: MinionDna): void {
        switch (dna.cloths) {
            case 0:
                this.remove(document, 'fancyDress');
                this.remove(document, 'workingCloth');
                this.remove(document, 'hawaii');
                break;
            case 1:
                this.remove(document, 'underwear');
                // document.getElementById('fancyDress').remove();
                this.remove(document, 'workingCloth');
                this.remove(document, 'hawaii');
                break;
            case 2:
                this.remove(document, 'underwear');
                this.remove(document, 'fancyDress');
                // document.getElementById('workingCloth').remove();
                this.remove(document, 'hawaii');
                break;
            case 3:
                this.remove(document, 'underwear');
                this.remove(document, 'fancyDress');
                this.remove(document, 'workingCloth');
                // document.getElementById('hawaii').remove();
                break;
            default:
                console.log(`cloth ${dna.cloths} unknown.`);

        }
    }
    private setItemInHands(document:Document,hand: string, itemInHand: number) {
        switch (itemInHand) {
            case 0:
                this.remove(document,`${hand}Banana`);
                this.remove(document,`${hand}Wrench`);
                this.remove(document,`${hand}Hammer`);
                this.remove(document,`${hand}Router`);
                this.remove(document,`${hand}Teddy`);
                this.remove(document,`${hand}Lollie`);
                this.remove(document,`${hand}Sign`);
                break;
            case 1:
                // this.svg.getElementById(`${hand}Banana`).remove();
                this.remove(document,`${hand}Wrench`);
                this.remove(document,`${hand}Hammer`);
                this.remove(document,`${hand}Router`);
                this.remove(document,`${hand}Teddy`);
                this.remove(document,`${hand}Lollie`);
                this.remove(document,`${hand}Sign`);
                break;
            case 2:
                this.remove(document,`${hand}Banana`);
                // this.svg.getElementById(`${hand}Wrench`).remove();
                this.remove(document,`${hand}Hammer`);
                this.remove(document,`${hand}Router`);
                this.remove(document,`${hand}Teddy`);
                this.remove(document,`${hand}Lollie`);
                this.remove(document,`${hand}Sign`);
                break;
            case 3:
                this.remove(document,`${hand}Banana`);
                this.remove(document,`${hand}Wrench`);
                // this.svg.getElementById(`${hand}Hammer`).remove();
                this.remove(document,`${hand}Router`);
                this.remove(document,`${hand}Teddy`);
                this.remove(document,`${hand}Lollie`);
                this.remove(document,`${hand}Sign`);
                break;
            case 4:
                this.remove(document,`${hand}Banana`);
                this.remove(document,`${hand}Wrench`);
                this.remove(document,`${hand}Hammer`);
                // this.svg.getElementById(`${hand}Router`).remove();
                this.remove(document,`${hand}Teddy`);
                this.remove(document,`${hand}Lollie`);
                this.remove(document,`${hand}Sign`);
                break;
            case 5:
                this.remove(document,`${hand}Banana`);
                this.remove(document,`${hand}Wrench`);
                this.remove(document,`${hand}Hammer`);
                this.remove(document,`${hand}Router`);
                // this.svg.getElementById(`${hand}Teddy`).remove();
                this.remove(document,`${hand}Lollie`);
                this.remove(document,`${hand}Sign`);
                break;
            case 6:
                this.remove(document,`${hand}Banana`);
                this.remove(document,`${hand}Wrench`);
                this.remove(document,`${hand}Hammer`);
                this.remove(document,`${hand}Router`);
                this.remove(document,`${hand}Teddy`);
                // this.svg.getElementById(`${hand}Lollie`).remove();
                this.remove(document,`${hand}Sign`);
                break;
            case 7:
                this.remove(document,`${hand}Banana`);
                this.remove(document,`${hand}Wrench`);
                this.remove(document,`${hand}Hammer`);
                this.remove(document,`${hand}Router`);
                this.remove(document,`${hand}Teddy`);
                this.remove(document,`${hand}Lollie`);
                // this.svg.getElementById(`${hand}Sign`).remove();
                break;
        }
    }

}
