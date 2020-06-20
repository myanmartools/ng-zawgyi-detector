import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector, ZawgyiDetectorModule } from '../src';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#misc', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ZawgyiDetectorModule]
        });

        zawgyiDetector = TestBed.inject<ZawgyiDetector>(ZawgyiDetector);
    });

    // tslint:disable-next-line: max-line-length
    it(
        String.raw`should detect input '\u1000\u102F\u1014\u1039\u1011\u102F\u1010\u1039\u101E\u1019\u101D\u102B\u101A\u1019' as 'zg'`,
        () => {
            const input = '\u1000\u102F\u1014\u1039\u1011\u102F\u1010\u1039\u101E\u1019\u101D\u102B\u101A\u1019';

            const result = zawgyiDetector.detect(input);

            void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
            void expect(result.matches.length).toBe(1, toFailOutput(input, result));
            void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5, toFailOutput(input, result));
        }
    );

    it(String.raw`should detect input '\u101B\u103D\u101A\u1039\u1015\u102B\u1015\u102E' as 'zg'`, () => {
        const input = '\u101B\u103D\u101A\u1039\u1015\u102B\u1015\u102E';

        const result = zawgyiDetector.detect(input);

        void expect(result.detectedEnc).toBe('zg', toFailOutput(input, result));
        void expect(result.matches.length).toBe(1, toFailOutput(input, result));
        void expect(result.matches[0].probability).toBeGreaterThanOrEqual(0.5, toFailOutput(input, result));
    });
});
