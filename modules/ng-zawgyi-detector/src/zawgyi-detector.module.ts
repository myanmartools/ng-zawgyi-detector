/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { ZAWGYI_DETECTOR_OPTIONS, ZawgyiDetector, ZawgyiDetectorOptions } from './zawgyi-detector';
import { ZgUniRuleStore } from './zg-uni-rule-store';

@NgModule({
    providers: [
        ZawgyiDetector
    ]
})
export class ZawgyiDetectorModule {
    static forRootWithRuleStore(options: ZawgyiDetectorOptions = { shareCachedRules: true }): ModuleWithProviders {
        return {
            ngModule: ZawgyiDetectorModule,
            providers: [
                ZgUniRuleStore,
                { provide: ZAWGYI_DETECTOR_OPTIONS, useValue: options }
            ]
        };
    }

    static forChildWithRuleStore(options: ZawgyiDetectorOptions = { shareCachedRules: true }): ModuleWithProviders {
        return {
            ngModule: ZawgyiDetectorModule,
            providers: [
                { provide: ZAWGYI_DETECTOR_OPTIONS, useValue: options },
            ]
        };
    }
}
