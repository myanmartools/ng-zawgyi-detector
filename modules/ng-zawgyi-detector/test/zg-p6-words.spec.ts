import { TestBed } from '@angular/core/testing';

import { DetectorResult, ZawgyiDetector, ZawgyiDetectorModule } from '../src';

import { toFailOutput } from './shared.spec';
import { zgP6Words } from './test-data/zg-p6-words';

describe('ZawgyiDetector#detect#zg-words#p6', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ZawgyiDetectorModule.withOptions({
                    preferZg: true
                })
            ]
        });

        zawgyiDetector = TestBed.inject<ZawgyiDetector>(ZawgyiDetector);
    });

    it(String.raw`should have probability >= '0.5' to all zg words`, () => {
        let lastResult: DetectorResult | null = null;
        let failedInput: string | null = null;

        for (const input of zgP6Words) {
            const result = zawgyiDetector.detect(input);
            lastResult = result;

            if (result.detectedEnc !== 'zg') {
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
