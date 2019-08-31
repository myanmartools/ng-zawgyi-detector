// tslint:disable: no-floating-promises
// tslint:disable: no-implicit-dependencies

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#uni-misc', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ZawgyiDetector
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    // Uni Punctuation
    it(String.raw`should detect input '၊ abc\n ။' as 'uni'`, () => {
        const input = '၊ abc\n ။';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(0.5, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ကချလာ' as 'uni'`, () => {
        const input = 'ကချလာ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.55, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ကလိယုဂ်ခေတ်' as 'uni'`, () => {
        const input = 'ကလိယုဂ်ခေတ်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.55, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ကုဗ်' as 'uni'`, () => {
        const input = 'ကုဗ်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.55, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'တံခါးမုခ်' as 'uni'`, () => {
        const input = 'တံခါးမုခ်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBeLessThan(0.55, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });
});
