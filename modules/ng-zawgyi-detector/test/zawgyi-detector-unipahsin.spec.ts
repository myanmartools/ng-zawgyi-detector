// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

describe('ZawgyiDetector#detect#unipahsin', () => {
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
        const result = zawgyiDetector.detect('ကဏ္ဍ');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.7);
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
        expect(result.matches[0].probability).toBe(0.7);
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
        expect(result.matches[0].probability).toBe(0.7);
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
        expect(result.matches[0].probability).toBe(0.51);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(8);
        expect(result.matches[0].matchedString).toBe('ပစ္ဆောင်');
    });
});
