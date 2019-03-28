/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Injectable } from '@angular/core';

import { ZgUniRegExpRule } from './zg-uni-regexp-rule';

@Injectable({
    providedIn: 'root'
})
export class ZgUniRuleStore {
    rule: ZgUniRegExpRule | null = null;
}
