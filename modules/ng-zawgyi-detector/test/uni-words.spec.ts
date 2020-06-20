import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

import { toFailOutput } from './shared.spec';
import { uniWords } from './test-data/uni-words';

describe('ZawgyiDetector#detect#uni-words', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ZawgyiDetector]
        });

        zawgyiDetector = TestBed.inject<ZawgyiDetector>(ZawgyiDetector);
    });

    it(String.raw`should have probability >= '0.5' to all uni words`, () => {
        for (const input of uniWords) {
            const result = zawgyiDetector.detect(input);
            void expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
            void expect(result.matches.length).toBe(1, toFailOutput(input, result));
            void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5, toFailOutput(input, result));
        }
    });
});
