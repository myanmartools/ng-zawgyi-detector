// tslint:disable: no-floating-promises
// tslint:disable: no-implicit-dependencies

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

import { toFailOutput } from './shared.spec';
import { uniWords } from './test-data/uni-words';

describe('ZawgyiDetector#detect#uni-words', () => {
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
        // ကချလာ
        for (const w of uniWords) {
            const result = zawgyiDetector.detect(w);
            expect(result.detectedEnc).toBe('uni', toFailOutput(w, result));

            if (result.detectedEnc !== 'uni') {
                break;
            }
        }
    });
});
