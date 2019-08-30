// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#uni-kinsi', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ZawgyiDetector
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    // Kinsi (1)
    it(String.raw`should detect input 'င်္' as 'uni'`, () => {
        const input = 'င်္';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Kinsi (2)
    it(String.raw`should detect input 'အင်္ဂါ' as 'uni'`, () => {
        const input = 'အင်္ဂါ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Kinsi (3)
    it(String.raw`should detect input 'သင်္ကန်း' as 'uni'`, () => {
        const input = 'သင်္ကန်း';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });
});
