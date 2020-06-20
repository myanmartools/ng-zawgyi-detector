import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector, ZawgyiDetectorModule } from '../src';

import { toFailOutput } from './shared.spec';
import { zgWords } from './test-data/zg-words';

describe('ZawgyiDetector#detect#zg-words', () => {
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
        for (const input of zgWords) {
            const result = zawgyiDetector.detect(input);
            void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
            void expect(result.matches.length).toBe(1, toFailOutput(input, result));
            void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5, toFailOutput(input, result));

            break;
        }
    });
});
