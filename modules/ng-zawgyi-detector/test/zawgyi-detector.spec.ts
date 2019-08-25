// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

describe('ZawgyiDetector#detect', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ZawgyiDetector
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    // Zawgyi detection
    // ----------------------------------------------------------------------
    it(String.raw`should detect input '\u1031\u1000' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1031\u1000');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
        expect(result.matches[0].matchedString).toBe('\u1031\u1000');
    });

    it(String.raw`should detect input '\u103B\u1000' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u103B\u1000');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
        expect(result.matches[0].matchedString).toBe('\u103B\u1000');
    });

    it(String.raw`should detect input '\u1031\u107E\u1000' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1031\u107E\u1000');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(3);
        expect(result.matches[0].matchedString).toBe('\u1031\u107E\u1000');
    });

    it(String.raw`should detect input ' \u1031 \u107E \u1000' as 'zg'`, () => {
        const result = zawgyiDetector.detect(' \u1031 \u107E \u1000');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(6);
        expect(result.matches[0].matchedString).toBe(' \u1031 \u107E \u1000');
    });

    // Unicode detection
    // ----------------------------------------------------------------------
    it(String.raw`should detect input '\u1000\u1031' as 'uni'`, () => {
        const result = zawgyiDetector.detect('\u1000\u1031');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
        expect(result.matches[0].matchedString).toBe('\u1000\u1031');
    });

    it(String.raw`should detect input '\u1000\u103C' as 'uni'`, () => {
        const result = zawgyiDetector.detect('\u1000\u103C');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.25);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
        expect(result.matches[0].matchedString).toBe('\u1000\u103C');
    });

    // Mix detection
    // ----------------------------------------------------------------------
    it(String.raw`should detect input '\u103B\u1000\n\u1000\u1031' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u103B\u1000\n\u1000\u1031');
        expect(result.detectedEnc).toBe('mix');
        expect(result.matches.length).toBe(2);

        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(3);
        expect(result.matches[0].matchedString).toBe('\u103B\u1000\n');

        expect(result.matches[1].detectedEnc).toBe('uni');
        expect(result.matches[1].probability).toBeGreaterThanOrEqual(0.5);
        expect(result.matches[1].start).toBe(3);
        expect(result.matches[1].length).toBe(2);
        expect(result.matches[1].matchedString).toBe('\u1000\u1031');
    });
});
