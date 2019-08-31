// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector, ZawgyiDetectorModule } from '../src';

describe('ZawgyiDetectorModule', () => {
    it("should provide 'ZawgyiDetector'", () => {
        TestBed.configureTestingModule({
            imports: [
                ZawgyiDetectorModule
            ]
        });

        const zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector);

        expect(zawgyiDetector).toBeDefined();
        expect(zawgyiDetector instanceof ZawgyiDetector).toBeTruthy();
    });
});

describe('ZawgyiDetectorModule#withOptions', () => {
    it("should include 'matchedString' in result when set 'includeMatchedStringInResult' = true", () => {
        TestBed.configureTestingModule({
            imports: [
                ZawgyiDetectorModule.withOptions({
                    preferZg: true
                })
            ]
        });

        const zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
        const result = zawgyiDetector.detect('\u1000');
        expect(result.detectedEnc).toBe('zg')
    });
});
