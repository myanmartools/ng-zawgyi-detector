// tslint:disable: no-floating-promises
// tslint:disable: no-implicit-dependencies

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

import { toFailOutput } from './shared.spec';
import { uniWords } from './test-data/uni-words';

describe('ZawgyiDetector#uniwords', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ZawgyiDetector
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    it('should detect as uni', () => {
        // const startIndex = 0;
        // const endIndex = 2999;
        // const input = uniWords.slice(startIndex, endIndex).join('\n');

        // const input = 'ကက်ကင်းဓာတ်';
        // const result = zawgyiDetector.detect(input);
        // expect(result.detectedEnc).toBe('uni', toFailOutput(input, result));

        for (const w of uniWords) {
            const result = zawgyiDetector.detect(w);
            expect(result.detectedEnc).toBe('uni', toFailOutput(w, result));

            if (result.detectedEnc !== 'uni') {
                break;
            }
        }
    });

    // it('should be Zawgyi expected words (3000-5999)', () => {
    //     const startIndex = 3000;
    //     const endIndex = 5999;
    //     const input = uniWords.slice(startIndex, endIndex).join('\n');

    //     const result = zawgyiDetector.detect(input);
    //     expect(result.detectedEnc).toBe('uni');
    // });

    // it('should be Zawgyi expected words (6000-8999)', () => {
    //     const startIndex = 6000;
    //     const endIndex = 8999;
    //     const input = uniWords.slice(startIndex, endIndex).join('\n');

    //     const result = zawgyiDetector.detect(input);
    //     expect(result.detectedEnc).toBe('uni');
    // });

    // it('should be Zawgyi expected words (>= 9000)', () => {
    //     const startIndex = 9000;
    //     const input = uniWords.slice(startIndex).join('\n');

    //     const result = zawgyiDetector.detect(input);
    //     expect(result.detectedEnc).toBe('uni');
    // });
});
