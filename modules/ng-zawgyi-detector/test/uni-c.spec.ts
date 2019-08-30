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
    it(String.raw`should detect input 'ကြကွ' as 'uni'`, () => {
        const input = 'ကြကွ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(0.5, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char + [\u1031\u103B] (1)
    it(String.raw`should detect input 'ကေ' as 'uni'`, () => {
        const input = 'ကေ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char + [\u1031\u103B] (2)
    it(String.raw`should detect input 'ကျေကျ' as 'uni'`, () => {
        const input = 'ကျေကျ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.6, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char + char + \u103A (1)
    it(String.raw`should detect input 'ခင်း' as 'uni'`, () => {
        const input = 'ခင်း';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char + char + \u103A (2)
    it(String.raw`should detect input 'ခင့်' as 'uni'`, () => {
        const input = 'ခင့်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char + char + \u103A (3)
    it(String.raw`should detect input 'ကခင်း' as 'uni'`, () => {
        const input = 'ကခင်း';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.7, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char + char + \u103A (4)
    it(String.raw`should detect input 'ခင်းက' as 'uni'`, () => {
        const input = 'ခင်းက';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.65, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char + char + \u103A (5)
    it(String.raw`should detect input 'ခင်' as 'uni'`, () => {
        const input = 'ခင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.55, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char + char + \u103A (6)
    it(String.raw`should detect input 'ကခင်' as 'uni'`, () => {
        const input = 'ကခင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.55, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char + char + \u103A (7)
    it(String.raw`should detect input 'ခင်က' as 'uni'`, () => {
        const input = 'ခင်က';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.55, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char + \u1031 + [\u102B\u102c] + char + \u103A (1)
    it(String.raw`should detect input 'အောင်း' as 'uni'`, () => {
        const input = 'အောင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.6, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char + \u1031 + [\u102B\u102c] + char + \u103A (2)
    it(String.raw`should detect input 'ကအောင်း' as 'uni'`, () => {
        const input = 'ကအောင်း';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.7, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Uni char + \u1031 + [\u102B\u102c] + char + \u103A (3)
    it(String.raw`should detect input 'အောင်းက' as 'uni'`, () => {
        const input = 'အောင်းက';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.7, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });
});
