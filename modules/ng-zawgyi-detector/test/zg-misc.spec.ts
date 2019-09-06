// tslint:disable: no-floating-promises
// tslint:disable: no-implicit-dependencies

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector, ZawgyiDetectorModule } from '../src';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#zg-misc', () => {
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

    // Undetactable start (1)
    it(String.raw`should detect input '\u105A' as 'zg'`, () => {
        const input = '\u105A';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Undetactable start (2)
    it(String.raw`should detect input '\u1060' as 'zg'`, () => {
        const input = '\u1060';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Undetactable start + char (1)
    it(String.raw`should detect input '\u105A\u1000' as 'zg'`, () => {
        const input = '\u105A\u1000';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Undetactable start + char (2)
    it(String.raw`should detect input '\u105A ။ \u1000' as 'zg'`, () => {
        const input = '\u105A ။ \u1000';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Undetactable end
    it(String.raw`should detect input '\u1000 ။ \u1060' as 'zg'`, () => {
        const input = '\u1000 ။ \u1060';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Undetactable end with seperator
    it(String.raw`should detect input '\u1000 ။\n[Zawgyi] \u1060' as 'zg'`, () => {
        const input = '\u1000 ။\n[Zawgyi] \u1060';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Seperator both Zg
    it(String.raw`should detect input '\u107E\u1000။\n[Zawgyi]\n\u1000\u1060' as 'zg'`, () => {
        const input = '\u107E\u1000။\n[Zawgyi]\n\u1000\u1060';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u1000\u1031\u1010\u102c\u1037' as 'zg'`, () => {
        const input = '\u1000\u1031\u1010\u102c\u1037';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u1001\u103c\u1000\u103a' as 'zg'`, () => {
        const input = '\u1001\u103c\u1000\u103a';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u1014\u1005\u1039\u1010\u1000\u103a' as 'zg'`, () => {
        const input = '\u1014\u1005\u1039\u1010\u1000\u103a';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u1010\u102d\u1010\u102d\u1000\u103a\u1000\u103a' as 'zg'`, () => {
        const input = '\u1010\u102d\u1010\u102d\u1000\u103a\u1000\u103a';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u1018\u102f\u1000\u103a' as 'zg'`, () => {
        const input = '\u1018\u102f\u1000\u103a';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u1004\u1014\u1039\u1015\u103a\u1015\u103a' as 'zg'`, () => {
        const input = '\u1004\u1014\u1039\u1015\u103a\u1015\u103a';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u1019\u1031\u1001\u103a\u102c' as 'zg'`, () => {
        const input = '\u1019\u1031\u1001\u103a\u102c';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u1010\u102f\u100f\u103d\u102d\u1031\u1018\u102c' as 'zg'`, () => {
        const input = '\u1010\u102f\u100f\u103d\u102d\u1031\u1018\u102c';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u1019\u102d\u1010\u1039\u1010\u1030\u1014\u1036\u1010\u1030' as 'zg'`, () => {
        const input = '\u1019\u102d\u1010\u1039\u1010\u1030\u1014\u1036\u1010\u1030';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u101C\u102D\u102F \u1037' as 'zg'`, () => {
        const input = '\u101C\u102D\u102F \u1037';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u1031 \u101C\u102D \u102F \u1037' as 'zg'`, () => {
        const input = '\u1031 \u101C\u102D \u102F \u1037';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u1000\u1060\u1033  \u1037' as 'zg'`, () => {
        const input = '\u1000\u1060\u1033  \u1037';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5, toFailOutput(input, result));
    });
});
