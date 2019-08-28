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
    // Uni punctuation
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

    // Uni only code points
    it(String.raw`should detect input 'ꩠꩿꧠꧾ' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ꩠꩿꧠꧾ');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(4);
        expect(result.matches[0].matchedString).toBe('ꩠꩿꧠꧾ');
    });

    // Uni only char (1)
    it(String.raw`should detect input 'ဿ' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ဿ');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(1);
        expect(result.matches[0].matchedString).toBe('ဿ');
    });

    // Uni only char + Ac (2)
    it(String.raw`should detect input 'ဿာ' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ဿာ');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
        expect(result.matches[0].matchedString).toBe('ဿာ');
    });

    // Uni char (1)
    it(String.raw`should detect input 'က' as 'uni'`, () => {
        const result = zawgyiDetector.detect('က');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.55);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(1);
        expect(result.matches[0].matchedString).toBe('က');
    });

    // Uni char (2)
    it(String.raw`should detect input 'ကက' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ကက');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.505);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
        expect(result.matches[0].matchedString).toBe('ကက');
    });

    // Uni char + [\u1031\u103B] (1)
    it(String.raw`should detect input 'ကေ' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ကေ');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(2);
        expect(result.matches[0].matchedString).toBe('ကေ');
    });

    // Uni char + [\u1031\u103B] (2)
    it(String.raw`should detect input 'ကေကျ' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ကေကျ');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.7);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(4);
        expect(result.matches[0].matchedString).toBe('ကေကျ');
    });

    // Uni char + [\u1031\u103B] (3)
    it(String.raw`should detect input 'ကကျ' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ကကျ');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.675);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(3);
        expect(result.matches[0].matchedString).toBe('ကကျ');
    });

    // Uni char + char + \u103A (1)
    it(String.raw`should detect input 'ခင်း' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ခင်း');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.95);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(4);
        expect(result.matches[0].matchedString).toBe('ခင်း');
    });

    // Uni char + char + \u103A (2)
    it(String.raw`should detect input 'ခင့်' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ခင့်');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.95);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(4);
        expect(result.matches[0].matchedString).toBe('ခင့်');
    });

    // Uni char + char + \u103A (3)
    it(String.raw`should detect input 'ကခင်း' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ကခင်း');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.7);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(5);
        expect(result.matches[0].matchedString).toBe('ကခင်း');
    });

    // Uni char + char + \u103A (3)
    it(String.raw`should detect input 'ခင်းက' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ခင်းက');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.65);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(5);
        expect(result.matches[0].matchedString).toBe('ခင်းက');
    });

    // Uni char + char + \u103A (4)
    it(String.raw`should detect input 'ခင်' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ခင်');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.55);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(3);
        expect(result.matches[0].matchedString).toBe('ခင်');
    });

    // Uni char + char + \u103A (5)
    it(String.raw`should detect input 'ကခင်' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ကခင်');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.51);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(4);
        expect(result.matches[0].matchedString).toBe('ကခင်');
    });

    // Uni char + char + \u103A (6)
    it(String.raw`should detect input 'ခင်က' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ခင်က');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.505);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(4);
        expect(result.matches[0].matchedString).toBe('ခင်က');
    });

    // Uni char + \u1031 + [\u102B\u102c] + char + \u103A (1)
    it(String.raw`should detect input 'အောင်း' as 'uni'`, () => {
        const result = zawgyiDetector.detect('အောင်း');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(1);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(6);
        expect(result.matches[0].matchedString).toBe('အောင်း');
    });

    // Uni char + \u1031 + [\u102B\u102c] + char + \u103A (2)
    it(String.raw`should detect input 'ကအောင်း' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ကအောင်း');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.7);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(7);
        expect(result.matches[0].matchedString).toBe('ကအောင်း');
    });

    // Uni char + \u1031 + [\u102B\u102c] + char + \u103A (3)
    it(String.raw`should detect input 'အောင်းက' as 'uni'`, () => {
        const result = zawgyiDetector.detect('အောင်းက');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.65);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(7);
        expect(result.matches[0].matchedString).toBe('အောင်းက');
    });

    // Pahsin (1)
    it(String.raw`should detect input 'ကဏ္ဍ' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ကဏ္ဍ');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.725);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(4);
        expect(result.matches[0].matchedString).toBe('ကဏ္ဍ');
    });

    // Pahsin (2)
    it(String.raw`should detect input 'ပစ္ဆေ' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ပစ္ဆေ');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.725);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(5);
        expect(result.matches[0].matchedString).toBe('ပစ္ဆေ');
    });

    // Pahsin (3)
    it(String.raw`should detect input 'ပဉ္စင်း' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ပဉ္စင်း');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.7375);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(7);
        expect(result.matches[0].matchedString).toBe('ပဉ္စင်း');
    });

    // Pahsin (4)
    it(String.raw`should detect input 'ပစ္ဆောင်' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ပစ္ဆောင်');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.7375);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(8);
        expect(result.matches[0].matchedString).toBe('ပစ္ဆောင်');
    });

    // Kinsi (1)
    it(String.raw`should detect input 'င်္' as 'uni'`, () => {
        const result = zawgyiDetector.detect('င်္');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.6);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(3);
        expect(result.matches[0].matchedString).toBe('င်္');
    });

    // Kinsi (2)
    it(String.raw`should detect input 'အင်္ဂါ' as 'uni'`, () => {
        const result = zawgyiDetector.detect('အင်္ဂါ');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.65);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(6);
        expect(result.matches[0].matchedString).toBe('အင်္ဂါ');
    });

    // Kinsi (3)
    it(String.raw`should detect input 'သင်္ကန်း' as 'uni'`, () => {
        const result = zawgyiDetector.detect('သင်္ကန်း');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.675);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(8);
        expect(result.matches[0].matchedString).toBe('သင်္ကန်း');
    });

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
