import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#uni-misc', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ZawgyiDetector]
        });

        zawgyiDetector = TestBed.inject<ZawgyiDetector>(ZawgyiDetector);
    });

    // Uni Punctuation
    it(String.raw`should detect input '၊ abc\n ။' as 'uni'`, () => {
        const input = '၊ abc\n ။';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // With newline
    it(String.raw`should detect input '\u1000\u1001\n' as 'uni'`, () => {
        const input = '\u1000\u1001\n';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Seperator both Uni
    it(String.raw`should detect input '\u1000\u1001။\n(Uni) ။==== \u1000\u1001\n' as 'uni'`, () => {
        const input = '\u1000\u1001။\n(Uni) ။==== \u1000\u1001\n';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ကချလာ' as 'uni'`, () => {
        const input = 'ကချလာ';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ကလိယုဂ်ခေတ်' as 'uni'`, () => {
        const input = 'ကလိယုဂ်ခေတ်';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'ကုဗ်' as 'uni'`, () => {
        const input = 'ကုဗ်';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input 'တံခါးမုခ်' as 'uni'`, () => {
        const input = 'တံခါးမုခ်';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    it(String.raw`should detect input '\u101a\u1031\u102c\u1000\u103a\u103b\u102c\u1038' as 'uni'`, () => {
        const input = '\u101a\u1031\u102c\u1000\u103a\u103b\u102c\u1038';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        void expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });
});
