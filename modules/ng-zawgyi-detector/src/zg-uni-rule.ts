/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

export interface ZgUniRuleItem {
    test: string;
    minInputLength: number;
    maxInputLength?: number;
    description?: string;
    excludes?: string[] | null;
    excludesStartAdjustPos?: number;
    excludeUniPahsinWords?: boolean;
    // checkUniPahsinConsonantsRule?: boolean;
}

export interface ZgUniRule {
    zgRules: ZgUniRuleItem[];
    uniRules: ZgUniRuleItem[];
    // stacked words
    uniPahsinWords: string[];
}
