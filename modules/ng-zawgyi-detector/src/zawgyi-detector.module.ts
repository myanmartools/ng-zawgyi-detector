/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { ZAWGYI_DETECTOR_OPTIONS, ZawgyiDetector, ZawgyiDetectorOptions } from './zawgyi-detector';

/**
 * The transliteration `NGMODULE` for providing `ZawgyiDetector` service.
 */
@NgModule({
    providers: [
        ZawgyiDetector
    ]
})
export class ZawgyiDetectorModule {
    /**
     * Provides options for configuring the `ZawgyiDetectorModule`.
     * @param options An object of configuration options of type `ZawgyiDetectorOptions`.
     */
    static withOptions(options: ZawgyiDetectorOptions): ModuleWithProviders {
        return {
            ngModule: ZawgyiDetectorModule,
            providers: [
                { provide: ZAWGYI_DETECTOR_OPTIONS, useValue: options }
            ]
        };
    }
}
