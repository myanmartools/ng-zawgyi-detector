/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { ZG_UNI_RULE_LOADER } from '@myanmartools/ng-zawgyi-detector';

import { HTTP_ZG_UNI_RULE_LOADER_OPTIONS, HttpZgUniRuleLoader, HttpZgUniRuleLoaderOptions } from './http-zg-uni-rule-loader';

@NgModule({
    providers: [
        {
            provide: ZG_UNI_RULE_LOADER,
            useClass: HttpZgUniRuleLoader
        }
    ]
})
export class HttpZgUniRuleLoaderModule {
    static withOptions(options: HttpZgUniRuleLoaderOptions = {}): ModuleWithProviders<HttpZgUniRuleLoaderModule> {
        return {
            ngModule: HttpZgUniRuleLoaderModule,
            providers: [
                {
                    provide: HTTP_ZG_UNI_RULE_LOADER_OPTIONS,
                    useValue: options
                }
            ],
        };
    }
}
