/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable: no-unnecessary-class

import { Injectable, NgModule } from '@angular/core';

import { Observable, of } from 'rxjs';

import { ZgUniRule } from './zg-uni-rule';
import { ZgUniRuleLoader } from './zg-uni-rule-loader';
import { ZG_UNI_RULE_LOADER } from './zg-uni-rule-loader.token';

@Injectable()
export class NoopZgUniRuleLoader implements ZgUniRuleLoader {
    load(): Observable<ZgUniRule> {
        return of({
            zgRules: [],
            uniRules: [],
            uniPahsinWords: []
        });
    }
}

@NgModule({
    providers: [
        {
            provide: ZG_UNI_RULE_LOADER,
            useClass: NoopZgUniRuleLoader
        }
    ]
})
export class NoopZgUniRuleLoaderModule { }
