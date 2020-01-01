// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

import { uniPahsinWords } from './test-data/uni-pahsin-words';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#uni-pahsin', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ZawgyiDetector
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    it(String.raw`should detect input 'ကဏ္ဍ' as 'uni'`, () => {
        const input = 'ကဏ္ဍ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.7, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ပစ္ဆေ' as 'uni'`, () => {
        const input = 'ပစ္ဆေ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.49, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ပဉ္စင်း' as 'uni'`, () => {
        const input = 'ပဉ္စင်း';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.49, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ပစ္ဆောင်' as 'uni'`, () => {
        const input = 'ပစ္ဆောင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.49, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ပဉ္စငါးပါး' as 'uni'`, () => {
        const input = 'ပဉ္စငါးပါး';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThan(0.49, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'မဥ္ဇရီ' as 'uni'`, () => {
        const input = 'မဥ္ဇရီ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThan(0.5, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'မဥ္ဇူ' as 'uni'`, () => {
        const input = 'မဥ္ဇူ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThan(0.5, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'အာဝဇ္ဇန်းရွှင်' as 'uni'`, () => {
        const input = 'အာဝဇ္ဇန်းရွှင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].probability).toBeGreaterThan(0.7, toFailOutput(input, result));
    });

    it(String.raw`should have probability > '0.49' to all pahsin words`, () => {
        for (const input of uniPahsinWords) {
            const result = zawgyiDetector.detect(input);

            expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
            expect(result.matches.length).toBe(1, toFailOutput(input, result));
            expect(result.matches[0].probability).toBeGreaterThan(0.49, toFailOutput(input, result));
        }
    });
});
