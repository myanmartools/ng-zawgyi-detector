// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

describe('ZawgyiDetector#detect#zgc', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ZawgyiDetector
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    // Possible Zg Chars
    //
    it(String.raw`should detect input '\u104E' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u104E');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(1);
    });

    it(String.raw`should detect input '\u104E\u106A\u106B\u1086\u108F\u1090' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u104E\u106A\u106B\u1086\u108F\u1090');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(6);
    });

    it(String.raw`should detect input '\n \u106A \u106B\u104B' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\n \u106A \u106B\u104B');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(6);
    });

    it(String.raw`should detect input '\u1000\u104E' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1000\u104E');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(0.75);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
    });

    it(String.raw`should detect input '\u104E\u1000' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u104E\u1000');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(0.76);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
    });

    // \u1039
    //
    it(String.raw`should detect input '\u1000\u1039' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1000\u1039');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(0.54);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
    });

    it(String.raw`should detect input '\u1000\u1039\u102F' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1000\u1039\u102F');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(0.54);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(3);
    });

    it(String.raw`should detect input '\u1001\u1039\u102F' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1001\u1039\u102F');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(0.54);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(3);
    });

    it(String.raw`should detect input '\u1000\u1000\u1039\u102F' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1000\u1000\u1039\u102F');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(0.52);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(4);
    });

    // Possible Zg Ac
    //
    it(String.raw`should detect input '\u1025\u1033' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1025\u1033');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
    });
});
