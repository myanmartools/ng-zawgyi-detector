// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#uni-c', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ZawgyiDetector
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    // Uni only code points
    it(String.raw`should detect input 'ꩠꩿꧠꧾ' as 'uni'`, () => {
        const input = 'ꩠꩿꧠꧾ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni only char
    it(String.raw`should detect input 'ဿ' as 'uni'`, () => {
        const input = 'ဿ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni only char + Ac
    it(String.raw`should detect input 'ဿာ' as 'uni'`, () => {
        const input = 'ဿာ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char (1)
    it(String.raw`should detect input 'က' as 'uni'`, () => {
        const input = 'က';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(0.5, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char (2)
    it(String.raw`should detect input 'ကက' as 'uni'`, () => {
        const input = 'ကက';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(0.5, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char (3)
    it(String.raw`should detect input 'ကွ' as 'uni'`, () => {
        const input = 'ကွ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(0.5, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char (4)
    it(String.raw`should detect input 'ကိကွ' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ကိကွ');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.505);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(4);
        expect(result.matches[0].matchedString).toBe('ကိကွ');
    });

    // Uni char (5)
    it(String.raw`should detect input 'ကိကွိ' as 'uni'`, () => {
        const result = zawgyiDetector.detect('ကိကွိ');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.51);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(5);
        expect(result.matches[0].matchedString).toBe('ကိကွိ');
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
        expect(result.matches[0].probability).toBe(0.675);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(4);
        expect(result.matches[0].matchedString).toBe('ကေကျ');
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
        expect(result.matches[0].probability).toBe(0.54);
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
        expect(result.matches[0].probability).toBe(0.51);
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
        expect(result.matches[0].probability).toBe(0.5);
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
});
