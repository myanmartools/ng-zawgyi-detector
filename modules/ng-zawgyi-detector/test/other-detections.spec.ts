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

    // Outside block
    it(String.raw`should detect input ' abc\n' as 'null'`, () => {
        const result = zawgyiDetector.detect(' abc\n');
        expect(result.detectedEnc).toBeFalsy();
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBeFalsy();
        expect(result.matches[0].probability).toBe(0);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(5);
        expect(result.matches[0].matchedString).toBe(' abc\n');
    });

    // Uni Punctuation
    it(String.raw`should detect input '၊ abc\n ။' as 'uni'`, () => {
        const result = zawgyiDetector.detect('၊ abc\n ။');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.5);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(8);
        expect(result.matches[0].matchedString).toBe('၊ abc\n ။');
    });

    // Mix detection
    // ----------------------------------------------------------------------
    // it(String.raw`should detect input '\u103B\u1000(Unicode)\n\u1000\u1031' as 'zg'`, () => {
    //     const result = zawgyiDetector.detect('\u103B\u1000(Unicode)\n\u1000\u1031');
    //     expect(result.detectedEnc).toBe('mix');
    //     expect(result.matches.length).toBe(2);

    //     expect(result.matches[0].detectedEnc).toBe('zg');
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(12);
    //     expect(result.matches[0].matchedString).toBe('\u103B\u1000(Unicode)\n');

    //     expect(result.matches[1].detectedEnc).toBe('uni');
    //     expect(result.matches[1].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[1].start).toBe(12);
    //     expect(result.matches[1].length).toBe(2);
    //     expect(result.matches[1].matchedString).toBe('\u1000\u1031');
    // });
});
