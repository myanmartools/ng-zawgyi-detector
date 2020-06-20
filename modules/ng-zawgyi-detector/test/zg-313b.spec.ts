import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector, ZawgyiDetectorModule } from '../src';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#zg-313b', () => {
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

    // \u1031 (1)
    it(String.raw`should detect input '\u1031\u1000' as 'zg'`, () => {
        const input = '\u104E';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u1031 (2)
    it(String.raw`should detect input '\u1031\u107E\u1000' as 'zg'`, () => {
        const input = '\u104E';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u1031 (3)
    it(String.raw`should detect input ' \u1031 \u107E \u1000' as 'zg'`, () => {
        const input = '\u104E';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u1031 (4)
    it(String.raw`should detect input '\u1031\u1000\u1060' as 'zg'`, () => {
        const input = '\u104E';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u1031 (5)
    it(String.raw`should detect input '\u1031\u1091' as 'zg'`, () => {
        const input = '\u104E';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u103B (1)
    it(String.raw`should detect input '\u103B\u1000' as 'zg'`, () => {
        const input = '\u104E';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u103B (2)
    it(String.raw`should detect input '\u107E\u1000\u1060' as 'zg'`, () => {
        const input = '\u104E';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u103B (3)
    it(String.raw`should detect input '\u107E\u1091' as 'zg'`, () => {
        const input = '\u104E';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });
});
