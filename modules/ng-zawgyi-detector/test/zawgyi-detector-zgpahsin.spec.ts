// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

describe('ZawgyiDetector#detect#zgpahsin', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ZawgyiDetector
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    it(String.raw`should detect input '\u1000\u1060' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1000\u1060');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
        expect(result.matches[0].matchedString).toBe('\u1000\u1060');
    });

    it(String.raw`should detect input '\u1091' as 'zg'`, () => {
        const result = zawgyiDetector.detect('\u1091');
        expect(result.detectedEnc).toBe('zg');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(1);
        expect(result.matches[0].matchedString).toBe('\u1091');
    });
});
