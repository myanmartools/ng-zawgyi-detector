// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

// import { uniPahsinWords } from './test-data/uni-pahsin-words';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#uni-athat', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ZawgyiDetector
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    it(String.raw`should detect input 'ယောက်ျား' as 'uni'`, () => {
        const input = 'ယောက်ျား';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ဩောင်း' as 'uni'`, () => {
        const input = 'ဩောင်း';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThan(0.9, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ကြောင်' as 'uni'`, () => {
        const input = 'ကြောင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'လျှောင်' as 'uni'`, () => {
        const input = 'လျှောင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'တောင်' as 'uni'`, () => {
        const input = 'တောင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ခေတ်' as 'uni'`, () => {
        const input = 'ခေတ်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'လျှော်' as 'uni'`, () => {
        const input = 'လျှော်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'တော်' as 'uni'`, () => {
        const input = 'တော်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ကျွင်' as 'uni'`, () => {
        const input = 'ကျွင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.9, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ခင်း' as 'uni'`, () => {
        const input = 'ခင်း';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.7, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ခွင်' as 'uni'`, () => {
        const input = 'ခွင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.52, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ခင်' as 'uni'`, () => {
        const input = 'ခင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.52, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ခက်' as 'uni'`, () => {
        const input = 'ခက်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ရွှင်' as 'uni'`, () => {
        const input = 'ရွှင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThan(0.9, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ကျွန်ုပ်' as 'uni'`, () => {
        const input = 'ကျွန်ုပ်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThan(0.9, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'လွှင့်' as 'uni'`, () => {
        // \u101c\u103d\u103e\u1004\u1037\u103a
        const input = 'လွှင့်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThan(0.9, toFailOutput(input, result));
    });
});
