/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { Observable } from 'rxjs';

import { ZgUniRule, ZgUniRuleLoader } from '@myanmartools/ng-zawgyi-detector';

export interface HttpZgUniRuleLoaderOptions {
    endpoint?: (() => string) | string;
}

export const HTTP_ZG_UNI_RULE_LOADER_OPTIONS = new InjectionToken<HttpZgUniRuleLoaderOptions>('HttpZgUniRuleLoaderOptions');

@Injectable()
export class HttpZgUniRuleLoader implements ZgUniRuleLoader {
    private readonly _endpointFactory: () => string;

    constructor(private readonly _httpClient: HttpClient,
        @Optional() @Inject(HTTP_ZG_UNI_RULE_LOADER_OPTIONS) options?: HttpZgUniRuleLoaderOptions) {
        if (options && options.endpoint) {
            if (typeof options.endpoint === 'function') {
                this._endpointFactory = options.endpoint;
            } else {
                const endpoint = options.endpoint;

                this._endpointFactory = () => {
                    return endpoint;
                };
            }
        } else {
            this._endpointFactory = () => {
                return '/assets/zawgyi-detect-rules/zg-uni-rule.json';
            };
        }
    }

    load(): Observable<ZgUniRule> {
        const endpoint = this._endpointFactory();

        return this._httpClient.get<ZgUniRule>(endpoint);
    }
}
