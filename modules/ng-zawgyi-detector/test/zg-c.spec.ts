// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector, ZawgyiDetectorModule } from '../src';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#zg-c', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ZawgyiDetectorModule.withOptions({
                    preferZg: true
                })
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    // Possible Zg Chars (1)
    it(String.raw`should detect input '\u104E' as 'zg'`, () => {
        const input = '\u104E';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Possible Zg Chars (2)
    it(String.raw`should detect input '\u104E\u106A\u106B\u1086\u108F\u1090' as 'zg'`, () => {
        const input = '\u104E\u106A\u106B\u1086\u108F\u1090';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Possible Zg Chars (3)
    it(String.raw`should detect input '\n \u106A \u106B\u104B' as 'zg'`, () => {
        const input = '\n \u106A \u106B\u104B';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Possible Zg Chars (4)
    it(String.raw`should detect input '\u1000\u104E' as 'zg'`, () => {
        const input = '\u1000\u104E';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.7, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Possible Zg Chars (5)
    it(String.raw`should detect input '\u104E\u1000' as 'zg'`, () => {
        const input = '\u104E\u1000';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.7, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u1039 (1)
    it(String.raw`should detect input '\u1000\u1004\u1039\u1038' as 'zg'`, () => {
        const input = '\u1000\u1004\u1039\u1038';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.85, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u1039 (2)
    it(String.raw`should detect input '\u1000\u1039' as 'zg'`, () => {
        const input = '\u1000\u1039';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.75, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u1039 (3)
    it(String.raw`should detect input '\u1000\u1039\u102F' as 'zg'`, () => {
        const input = '\u1000\u1039\u102F';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.7, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u1039 (4)
    it(String.raw`should detect input '\u1000\u1000\u1039\u102F' as 'zg'`, () => {
        const input = '\u1000\u1000\u1039\u102F';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.6, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u1039 (5)
    it(String.raw`should detect input '\u104E\u1000\u1000\u1039\u1000' as 'zg'`, () => {
        const input = '\u104E\u1000\u1039';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.6, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u1039 (6)
    it(String.raw`should detect input '\u1000\u1000\u1039\u1000' as 'zg'`, () => {
        const input = '\u1000\u1000\u1039\u1000';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.55, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u103A (1)
    it(String.raw`should detect input '\u1000\u103A\u1034\u1000\u103A\u1034' as 'zg'`, () => {
        const input = '\u1000\u103A\u1034\u1000\u103A\u1034';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.86, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u103A (2)
    it(String.raw`should detect input '\u1000\u103A\u1034' as 'zg'`, () => {
        const input = '\u1000\u103A\u1034';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.85, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u103A (3)
    it(String.raw`should detect input '\u1000\u103A' as 'zg'`, () => {
        const input = '\u1000\u103A';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.54, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u103A (4)
    it(String.raw`should detect input '\u1000\u103A\u1000\u103A' as 'zg'`, () => {
        const input = '\u1000\u103A\u1000\u103A';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.55, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u103A (5)
    it(String.raw`should detect input '\u1000\u102D\u103A' as 'zg'`, () => {
        const input = '\u1000\u102D\u103A';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.55, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u103A (6)
    it(String.raw`should detect input '\u1004\u102D\u103A' as 'zg'`, () => {
        const input = '\u1004\u102D\u103A';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.55, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u103D (1)
    it(String.raw`should detect input '\u1000\u103C\u103D' as 'zg'`, () => {
        const input = '\u1000\u103C\u103D';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.52, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // \u103D (2)
    it(String.raw`should detect input '\u104E\u1000\u103D' as 'zg'`, () => {
        const input = '\u104E\u1000\u103D';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.6, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Possible Zg Ac
    //
    it(String.raw`should detect input '\u1025\u1033' as 'zg'`, () => {
        const input = '\u1025\u1033';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.85, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });
});
