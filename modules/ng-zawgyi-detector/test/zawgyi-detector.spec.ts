// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

describe('ZawgyiDetector', () => {
    it('should be created', () => {
        TestBed.configureTestingModule({
            providers: [
                ZawgyiDetector
            ]
        });

        const zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector);

        expect(zawgyiDetector).toBeDefined();
        expect(zawgyiDetector instanceof ZawgyiDetector).toBeTruthy();
    });
});
