// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

describe('ZawgyiDetector#detect#unikinsi', () => {
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
        const result = zawgyiDetector.detect('င်္');
        expect(result.detectedEnc).toBe('uni');
        expect(result.matches.length).toBe(1);
        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].probability).toBe(0.6);
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
        expect(result.matches[0].probability).toBe(0.65);
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
        expect(result.matches[0].probability).toBe(0.675);
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].length).toBe(8);
        expect(result.matches[0].matchedString).toBe('သင်္ကန်း');
    });
});
