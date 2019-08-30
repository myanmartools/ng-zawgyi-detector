// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

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

    // Pahsin (1)
    it(String.raw`should detect input 'ကဏ္ဍ' as 'uni'`, () => {
        const input = 'ကဏ္ဍ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Pahsin (2)
    it(String.raw`should detect input 'ပစ္ဆေ' as 'uni'`, () => {
        const input = 'ပစ္ဆေ';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Pahsin (3)
    it(String.raw`should detect input 'ပဉ္စင်း' as 'uni'`, () => {
        const input = 'ပဉ္စင်း';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Pahsin (4)
    it(String.raw`should detect input 'ပစ္ဆောင်' as 'uni'`, () => {
        const input = 'ပစ္ဆောင်';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBe('uni', toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });
});
