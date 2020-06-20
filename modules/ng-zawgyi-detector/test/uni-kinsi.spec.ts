import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#uni-kinsi', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ZawgyiDetector]
        });

        zawgyiDetector = TestBed.inject<ZawgyiDetector>(ZawgyiDetector);
    });

    // Kinsi (1)
    it(String.raw`should detect input 'င်္' as 'uni'`, () => {
        const input = 'င်္';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.6, toFailOutput(input, result));
    });

    // Kinsi (2)
    it(String.raw`should detect input 'အင်္ဂါ' as 'uni'`, () => {
        const input = 'အင်္ဂါ';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.7, toFailOutput(input, result));
    });

    // Kinsi (3)
    it(String.raw`should detect input 'သင်္ကန်း' as 'uni'`, () => {
        const input = 'သင်္ကန်း';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.7, toFailOutput(input, result));
    });
});
