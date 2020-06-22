import { TestBed } from '@angular/core/testing';

import { DetectorResult, ZawgyiDetector } from '../src';

import { toFailOutput } from './shared.spec';
import { uniP10Words } from './test-data/uni-p10-words';

describe('ZawgyiDetector#detect#uni-words#p10', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ZawgyiDetector]
        });

        zawgyiDetector = TestBed.inject<ZawgyiDetector>(ZawgyiDetector);
    });

    it(String.raw`should have probability >= '0.5' to all uni words`, () => {
        let lastResult: DetectorResult | null = null;
        let failedInput: string | null = null;

        for (const input of uniP10Words) {
            const result = zawgyiDetector.detect(input);
            lastResult = result;

            if (result.detectedEnc !== 'uni') {
                failedInput = input;
                break;
            }

            if (result.matches.length !== 1) {
                failedInput = input;
                break;
            }

            if (result.matches[0].probability < 0.5) {
                failedInput = input;
                break;
            }
        }

        void expect(failedInput).toBe(null, toFailOutput(failedInput as string, lastResult as DetectorResult));
    });
});