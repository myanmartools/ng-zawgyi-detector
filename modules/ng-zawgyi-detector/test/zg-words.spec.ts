// tslint:disable: no-floating-promises
// tslint:disable: no-implicit-dependencies

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector, ZawgyiDetectorModule } from '../src';

import { toFailOutput } from './shared.spec';
import { zgWords } from './test-data/zg-words';

describe('ZawgyiDetector#detect#zg-words', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ZawgyiDetectorModule.withOptions({
                    preferZg: true
                })
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    it('should detect as zg', () => {
        // ကချလာ
        for (const w of zgWords) {
            const result = zawgyiDetector.detect(w);
            expect(result.detectedEnc).toBe('zg', toFailOutput(w, result));

            if (result.detectedEnc !== 'zg') {
                break;
            }
        }
    });
});
