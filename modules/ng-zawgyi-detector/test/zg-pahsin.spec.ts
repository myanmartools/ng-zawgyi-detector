import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector, ZawgyiDetectorModule } from '../src';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#zg-pahsin', () => {
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

    it(String.raw`should detect input '\u1000\u1060' as 'zg'`, () => {
        const input = '\u1000\u1060';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u1091' as 'zg'`, () => {
        const input = '\u1091';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });
});
