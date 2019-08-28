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

    // Detect outside block
    // ----------------------------------------------------------------------
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

    // Unicode detection
    // ----------------------------------------------------------------------
    // Punctuation
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

    // Detect non Zg
    // it(String.raw`should detect input ' abc\nဢ' as 'uni'`, () => {
    //     const result = zawgyiDetector.detect(' abc\nဢ');
    //     expect(result.detectedEnc).toBe('uni');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].detectedEnc).toBe('uni');
    //     // expect(result.matches[0].probability).toBe(0);
    //     // expect(result.matches[0].start).toBe(0);
    //     // expect(result.matches[0].length).toBe(5);
    //     // expect(result.matches[0].matchedString).toBe(' abc\n');
    // });

    // detectUniKinsi

    // it(String.raw`should detect input 'ခြင်္သေ့' as 'uni'`, () => {
    //     const result = zawgyiDetector.detect('ခြင်္သေ့');
    //     expect(result.detectedEnc).toBe('uni');
    //     expect(result.matches.length).toBe(1);
    //     // expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     // expect(result.matches[0].start).toBe(0);
    //     // expect(result.matches[0].length).toBe(2);
    //     // expect(result.matches[0].matchedString).toBe('\u1000\u1031');
    // });

    // it(String.raw`should detect input '\u1000\u103C' as 'uni'`, () => {
    //     const result = zawgyiDetector.detect('\u1000\u103C');
    //     expect(result.detectedEnc).toBe('uni');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.25);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(2);
    //     expect(result.matches[0].matchedString).toBe('\u1000\u103C');
    // });

    // Zawgyi detection
    // ----------------------------------------------------------------------
    // // \u1031
    // it(String.raw`should detect input '\u1031\u1000' as 'zg'`, () => {
    //     const result = zawgyiDetector.detect('\u1031\u1000');
    //     expect(result.detectedEnc).toBe('zg');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(2);
    //     expect(result.matches[0].matchedString).toBe('\u1031\u1000');
    // });

    // it(String.raw`should detect input '\u1031\u107E\u1000' as 'zg'`, () => {
    //     const result = zawgyiDetector.detect('\u1031\u107E\u1000');
    //     expect(result.detectedEnc).toBe('zg');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(3);
    //     expect(result.matches[0].matchedString).toBe('\u1031\u107E\u1000');
    // });

    // it(String.raw`should detect input ' \u1031 \u107E \u1000' as 'zg'`, () => {
    //     const result = zawgyiDetector.detect(' \u1031 \u107E \u1000');
    //     expect(result.detectedEnc).toBe('zg');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(6);
    //     expect(result.matches[0].matchedString).toBe(' \u1031 \u107E \u1000');
    // });

    // it(String.raw`should detect input '\u1031\u1000\u1060' as 'zg'`, () => {
    //     const result = zawgyiDetector.detect('\u1031\u1000\u1060');
    //     expect(result.detectedEnc).toBe('zg');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(3);
    //     expect(result.matches[0].matchedString).toBe('\u1031\u1000\u1060');
    // });

    // it(String.raw`should detect input '\u1031\u1091' as 'zg'`, () => {
    //     const result = zawgyiDetector.detect('\u1031\u1091');
    //     expect(result.detectedEnc).toBe('zg');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(2);
    //     expect(result.matches[0].matchedString).toBe('\u1031\u1091');
    // });

    // // \u103B
    // it(String.raw`should detect input '\u103B\u1000' as 'zg'`, () => {
    //     const result = zawgyiDetector.detect('\u103B\u1000');
    //     expect(result.detectedEnc).toBe('zg');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(2);
    //     expect(result.matches[0].matchedString).toBe('\u103B\u1000');
    // });

    // it(String.raw`should detect input '\u107E\u1000\u1060' as 'zg'`, () => {
    //     const result = zawgyiDetector.detect('\u107E\u1000\u1060');
    //     expect(result.detectedEnc).toBe('zg');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(3);
    //     expect(result.matches[0].matchedString).toBe('\u107E\u1000\u1060');
    // });

    // it(String.raw`should detect input '\u107E\u1091' as 'zg'`, () => {
    //     const result = zawgyiDetector.detect('\u107E\u1091');
    //     expect(result.detectedEnc).toBe('zg');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(2);
    //     expect(result.matches[0].matchedString).toBe('\u107E\u1091');
    // });

    // // Pahsin
    // it(String.raw`should detect input '\u1000\u1060' as 'zg'`, () => {
    //     const result = zawgyiDetector.detect('\u1000\u1060');
    //     expect(result.detectedEnc).toBe('zg');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(2);
    //     expect(result.matches[0].matchedString).toBe('\u1000\u1060');
    // });

    // it(String.raw`should detect input '\u1091' as 'zg'`, () => {
    //     const result = zawgyiDetector.detect('\u1091');
    //     expect(result.detectedEnc).toBe('zg');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(1);
    //     expect(result.matches[0].matchedString).toBe('\u1091');
    // });

    // // ZgC
    // it(String.raw`should detect input '\u1025\u1033' as 'zg'`, () => {
    //     const result = zawgyiDetector.detect('\u1025\u1033');
    //     expect(result.detectedEnc).toBe('zg');
    //     expect(result.matches.length).toBe(1);
    //     expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5);
    //     expect(result.matches[0].start).toBe(0);
    //     expect(result.matches[0].length).toBe(2);
    //     expect(result.matches[0].matchedString).toBe('\u1025\u1033');
    // });

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
