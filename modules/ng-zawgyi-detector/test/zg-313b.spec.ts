// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

describe('ZawgyiDetector#detect#zg313b', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ZawgyiDetector
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    // \u1031 (1)
    it(String.raw`should detect input '\u1031\u1000' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1031\u1000');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
        expect(result.matches[0].matchedString).toBe('\u1031\u1000');
    });

    // \u1031 (2)
    it(String.raw`should detect input '\u1031\u107E\u1000' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1031\u107E\u1000');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(3);
        expect(result.matches[0].matchedString).toBe('\u1031\u107E\u1000');
    });

    // \u1031 (3)
    it(String.raw`should detect input ' \u1031 \u107E \u1000' as 'zg'`, () => {
        const result = zawgyiDetector.detect(' \u1031 \u107E \u1000');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(6);
        expect(result.matches[0].matchedString).toBe(' \u1031 \u107E \u1000');
    });

    // \u1031 (4)
    it(String.raw`should detect input '\u1031\u1000\u1060' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1031\u1000\u1060');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(3);
        expect(result.matches[0].matchedString).toBe('\u1031\u1000\u1060');
    });

    // \u1031 (5)
    it(String.raw`should detect input '\u1031\u1091' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1031\u1091');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
        expect(result.matches[0].matchedString).toBe('\u1031\u1091');
    });

    // \u103B (1)
    it(String.raw`should detect input '\u103B\u1000' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u103B\u1000');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
        expect(result.matches[0].matchedString).toBe('\u103B\u1000');
    });

    // \u103B (2)
    it(String.raw`should detect input '\u107E\u1000\u1060' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u107E\u1000\u1060');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(3);
        expect(result.matches[0].matchedString).toBe('\u107E\u1000\u1060');
    });

    // \u103B (3)
    it(String.raw`should detect input '\u107E\u1091' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u107E\u1091');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
        expect(result.matches[0].matchedString).toBe('\u107E\u1091');
    });
});
