/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { Observable, Observer, of } from 'rxjs';
import { share, take } from 'rxjs/operators';

import { ZgUniDetectResult } from './zg-uni-detect-result';
import { ZgUniRegExpRule, ZgUniRuleRegExpItem } from './zg-uni-regexp-rule';
import { ZgUniRule, ZgUniRuleItem } from './zg-uni-rule';
import { ZgUniRuleLoader } from './zg-uni-rule-loader';
import { ZG_UNI_RULE_LOADER } from './zg-uni-rule-loader.token';
import { ZgUniRuleStore } from './zg-uni-rule-store';

export interface ZawgyiDetectorOptions {
    shareCachedRules?: boolean;
}

export const ZAWGYI_DETECTOR_OPTIONS = new InjectionToken<ZawgyiDetectorOptions>('ZawgyiDetectorOptions');

@Injectable()
export class ZawgyiDetector {
    private readonly _options: ZawgyiDetectorOptions;

    // Standard code point
    private readonly _stdCodeRange = /[\u1000-\u109F]/;
    private readonly _stdCodeRangeGlobal = /[\u1000-\u109F]/g;

    // Extended-A
    private readonly _extACodeRange = /[\uAA60-\uAA7F]/;
    private readonly _extACodeRangeGlobal = /[\uAA60-\uAA7F]/g;

    // Extended-B
    private readonly _extBCodeRange = /[\uA9E0-\uA9FF]/;
    private readonly _extBCodeRangeGlobal = /[\uA9E0-\uA9FF]/g;

    private _cachedRule: ZgUniRegExpRule | null = null;
    private _currentfetchingRequest: Observable<ZgUniRule> | null = null;
    private _fetching = false;

    get cachedRule(): ZgUniRegExpRule | null {
        return this._options.shareCachedRules && this._ruleStore ? this._ruleStore.rule : this._cachedRule;
    }

    constructor(
        @Inject(ZG_UNI_RULE_LOADER) private readonly _ruleLoader: ZgUniRuleLoader,
        @Optional() private readonly _ruleStore?: ZgUniRuleStore,
        @Optional() @Inject(ZAWGYI_DETECTOR_OPTIONS) options?: ZawgyiDetectorOptions) {
        if (options && options.shareCachedRules && !_ruleStore) {
            throw new Error('To use shareCachedRules, provide ZgUniRuleStore in root module.');
        }

        this._options = options || {};
    }

    detect(input: string): Observable<ZgUniDetectResult> {
        if (!input || !input.length || !input.trim().length) {
            return of({
                detectedEnc: null,
                probability: 0,
                containsUnicodeBlocks: false,
                uniMatches: [],
                zgMatches: [],
                stdCodePointsMatchedCount: 0,
                extCodePointsMatchedCount: 0
            });
        }

        this.loadRule();

        if (this.cachedRule && !this._fetching) {
            const result = this.processDetect(input, this.cachedRule);

            return of(result);
        }

        return new Observable((observer: Observer<ZgUniDetectResult>) => {
            const onComplete = (res: ZgUniDetectResult) => {
                observer.next(res);
                observer.complete();
            };

            const onError = (err: Error) => {
                observer.error(err);
            };

            if (this._currentfetchingRequest != null) {
                this._currentfetchingRequest
                    .subscribe(() => {
                        if (!this.cachedRule) {
                            onError(new Error('Error in loading ZawgyiDetectRule rule.'));

                            return;
                        }

                        const result = this.processDetect(input, this.cachedRule);
                        onComplete(result);
                    }, onError);
            } else {
                if (this.cachedRule) {
                    const result = this.processDetect(input, this.cachedRule);
                    onComplete(result);
                } else {
                    onError(new Error('Error in loading ZawgyiDetectRule rule.'));
                }
            }

        });
    }

    loadRule(): Observable<ZgUniRule> {
        this._fetching = true;

        const obs = this._ruleLoader.load().pipe(share());

        this._currentfetchingRequest = obs.pipe(
            take(1),
            share()
        );

        this._currentfetchingRequest
            .subscribe((rule) => {
                this.constructAndCacheRule(rule);
                this._fetching = false;
            }, () => {
                this._fetching = false;
            });

        return obs;
    }

    private processDetect(input: string, rule: ZgUniRegExpRule): ZgUniDetectResult {
        const result: ZgUniDetectResult = {
            detectedEnc: null,
            probability: 0,
            containsUnicodeBlocks: false,
            uniMatches: [],
            zgMatches: [],
            stdCodePointsMatchedCount: 0,
            extCodePointsMatchedCount: 0
        };

        this.processCodePointsMatch(input, result);

        if (!result.containsUnicodeBlocks) {
            return result;
        }

        const trimedInput = input.trim();

        // If in only ext unicode block
        if (result.stdCodePointsMatchedCount < 1 && result.extCodePointsMatchedCount > 0) {
            result.detectedEnc = 'uni';
            // 0.9 - 0.99
            result.probability = ((result.extCodePointsMatchedCount / trimedInput.length) * 0.09) + 0.9;
        }

        this.processMatches(trimedInput, rule, rule.zgRegExpRules, true, result);
        this.processMatches(trimedInput, rule, rule.uniRegExpRules, false, result);

        this.calculateWhenUniEqZg(trimedInput, result);
        this.calculateWhenZgGtUni(result);
        this.calculateWhenUniGtZg(result);

        return result;
    }

    private calculateWhenUniEqZg(input: string, result: ZgUniDetectResult): void {
        const totalBlocksMatchCount = result.stdCodePointsMatchedCount + result.extCodePointsMatchedCount;
        const zgMatchedCount = result.zgMatches.length;
        const uniMatchedCount = result.uniMatches.length;

        if (totalBlocksMatchCount < 1 || zgMatchedCount !== uniMatchedCount) {
            return;
        }

        if (zgMatchedCount === 0 && uniMatchedCount === 0) {
            result.detectedEnc = 'uni';

            const inputLength = input.trim().length;

            if (totalBlocksMatchCount === inputLength) {
                result.probability = 0.99;
            } else if (totalBlocksMatchCount >= 10) {
                // 0.31 - 0.5
                result.probability = ((totalBlocksMatchCount / inputLength) * 0.2) + 0.3;
            } else {
                // 0.1 - 0.4
                result.probability = ((totalBlocksMatchCount / 10) * 0.25) + ((totalBlocksMatchCount / inputLength) * 0.05) + 0.1;
            }

            return;
        }

        result.detectedEnc = 'zg';

        // max 0.25
        if (zgMatchedCount >= 30) {
            // 0.15 - 0.25
            const maxTotal = zgMatchedCount > 100 ? 100 : zgMatchedCount;
            result.probability = ((maxTotal / 100) * 0.1) + 0.15;
        } if (zgMatchedCount >= 8) {
            // 0.08 - 0.15
            result.probability = ((zgMatchedCount / 30) * 0.07) + 0.08;
        } else if (zgMatchedCount >= 5) {
            // 0.05 - 0.08
            result.probability = ((zgMatchedCount / 8) * 0.03) + 0.05;
        } else if (zgMatchedCount >= 3) {
            // 0.025 - 0.05
            result.probability = ((zgMatchedCount / 5) * 0.025) + 0.025;
        } else {
            result.probability = 0.025;
        }
    }

    private calculateWhenZgGtUni(result: ZgUniDetectResult): void {
        const totalBlocksMatchCount = result.stdCodePointsMatchedCount + result.extCodePointsMatchedCount;
        const zgMatchedCount = result.zgMatches.length;
        const uniMatchedCount = result.uniMatches.length;

        if (zgMatchedCount < 1 ||
            totalBlocksMatchCount < 1 ||
            uniMatchedCount >= zgMatchedCount) {
            return;
        }

        result.detectedEnc = 'zg';

        if (uniMatchedCount < 1) {
            if (zgMatchedCount >= 30) {
                // 0.66 - 0.8 - 0.85
                const maxTotal = zgMatchedCount > 100 ? 100 : zgMatchedCount;
                result.probability = ((maxTotal / 100) * 0.2) + ((zgMatchedCount / totalBlocksMatchCount) * 0.05) + 0.6;
            } if (zgMatchedCount >= 8) {
                // 0.5 - 0.66 + - 0.74
                result.probability = ((zgMatchedCount / 30) * 0.16) + ((zgMatchedCount / totalBlocksMatchCount) * 0.08) + 0.5;
            } else if (zgMatchedCount >= 5) {
                // 0.4 - 0.5 - 0.6
                result.probability = ((zgMatchedCount / 8) * 0.1) + ((zgMatchedCount / totalBlocksMatchCount) * 0.09) + 0.4;
            } else if (zgMatchedCount >= 3) {
                // 0.2 - 0.4 - 0.5
                result.probability = ((zgMatchedCount / 5) * 0.2) + ((zgMatchedCount / totalBlocksMatchCount) * 0.1) + 0.2;
            } else if (zgMatchedCount >= 2) {
                // 0.1 - 0.2
                result.probability = ((zgMatchedCount / totalBlocksMatchCount) * 0.1) + 0.1;
            } else {
                // < 0.1
                result.probability = (zgMatchedCount / totalBlocksMatchCount) * 0.1;
            }

            return;
        }

        if (zgMatchedCount >= 8) {
            result.probability = zgMatchedCount / (uniMatchedCount + zgMatchedCount) / 1.5;
        } else if (zgMatchedCount >= 5) {
            result.probability = (zgMatchedCount / (uniMatchedCount + zgMatchedCount)) / 2;
        } else if (zgMatchedCount >= 3) {
            result.probability = (zgMatchedCount / (uniMatchedCount + zgMatchedCount)) / 3;
        } else {
            result.probability = (zgMatchedCount / (uniMatchedCount + zgMatchedCount)) / 4;
        }
    }

    private calculateWhenUniGtZg(result: ZgUniDetectResult): void {
        const totalBlocksMatchCount = result.stdCodePointsMatchedCount + result.extCodePointsMatchedCount;
        const zgMatchedCount = result.zgMatches.length;
        const uniMatchedCount = result.uniMatches.length;

        if (uniMatchedCount < 1 ||
            totalBlocksMatchCount < 1 ||
            zgMatchedCount >= uniMatchedCount) {
            return;
        }

        if (zgMatchedCount < 1) {
            result.detectedEnc = 'uni';

            let c1 = 0;
            if (uniMatchedCount >= 5) {
                c1 = totalBlocksMatchCount > 1000 ? 0.2 : (totalBlocksMatchCount / 1000) * 0.2;
            }

            if (uniMatchedCount >= 30) {
                const maxTotal = uniMatchedCount > 100 ? 100 : uniMatchedCount;
                result.probability = ((maxTotal / 100) * 0.1) + c1 + 0.559;
            } if (uniMatchedCount >= 8) {
                result.probability = ((uniMatchedCount / 30) * 0.07) + c1 + 0.558;
            } else if (uniMatchedCount >= 5) {
                result.probability = ((uniMatchedCount / 8) * 0.03) + c1 + 0.527;
            } else if (uniMatchedCount >= 3) {
                // 0.501 - 0.526
                result.probability = ((uniMatchedCount / 5) * 0.025) + 0.501;
            } else {
                // 0.4 - 0.5
                result.probability = ((uniMatchedCount / 2) * 0.1) + 0.4;
            }

            return;
        }

        let acceptableDiff = 0;
        let acceptableTotalUnicodeRatio = 0.08;

        if (uniMatchedCount >= 20) {
            acceptableDiff = Math.floor(uniMatchedCount / 2);
            acceptableTotalUnicodeRatio = 0.07;
        } else if (uniMatchedCount >= 14) {
            acceptableDiff = 4;
            acceptableTotalUnicodeRatio = 0.07;
        } else if (uniMatchedCount >= 11) {
            acceptableDiff = 3;
            acceptableTotalUnicodeRatio = 0.065;
        } else if (uniMatchedCount >= 9) {
            acceptableDiff = 2;
            acceptableTotalUnicodeRatio = 0.06;
        } else if (uniMatchedCount >= 6) {
            acceptableDiff = 1;
            acceptableTotalUnicodeRatio = 0.05;
        } else if (uniMatchedCount >= 3) {
            acceptableDiff = 1;
            acceptableTotalUnicodeRatio = 0.045;
        } else {
            acceptableDiff = 1;
            acceptableTotalUnicodeRatio = 0.04;
        }

        if (zgMatchedCount + acceptableDiff >= uniMatchedCount &&
            (zgMatchedCount / totalBlocksMatchCount >= acceptableTotalUnicodeRatio)) {
            result.detectedEnc = 'zg';
            if (zgMatchedCount >= 8) {
                result.probability = zgMatchedCount / (uniMatchedCount + zgMatchedCount) / 1.5;
            } else if (zgMatchedCount >= 5) {
                result.probability = (zgMatchedCount / (uniMatchedCount + zgMatchedCount)) / 2;
            } else if (zgMatchedCount >= 3) {
                result.probability = (zgMatchedCount / (uniMatchedCount + zgMatchedCount)) / 3;
            } else {
                result.probability = (zgMatchedCount / (uniMatchedCount + zgMatchedCount)) / 4;
            }
        } else {
            result.detectedEnc = 'uni';
            if (uniMatchedCount >= 8) {
                result.probability = uniMatchedCount / (uniMatchedCount + zgMatchedCount) / 1.5;
            } else if (uniMatchedCount >= 5) {
                result.probability = (uniMatchedCount / (uniMatchedCount + zgMatchedCount)) / 2;
            } else if (uniMatchedCount >= 3) {
                result.probability = (uniMatchedCount / (uniMatchedCount + zgMatchedCount)) / 3;
            } else {
                result.probability = (uniMatchedCount / (uniMatchedCount + zgMatchedCount)) / 4;
            }
        }
    }

    private processCodePointsMatch(input: string, result: ZgUniDetectResult): void {
        if (this._stdCodeRange.test(input)) {
            result.containsUnicodeBlocks = true;

            const m = input.match(this._stdCodeRangeGlobal);
            if (m && m.length > 0) {
                result.stdCodePointsMatchedCount = m.length;
            }
        }

        if (this._extACodeRange.test(input)) {
            result.containsUnicodeBlocks = true;

            const m = input.match(this._extACodeRangeGlobal);
            if (m && m.length > 0) {
                result.extCodePointsMatchedCount += m.length;
            }
        }

        if (this._extBCodeRange.test(input)) {
            result.containsUnicodeBlocks = true;

            const m = input.match(this._extBCodeRangeGlobal);
            if (m && m.length > 0) {
                result.extCodePointsMatchedCount += m.length;
            }
        }
    }

    private processMatches(input: string,
        rule: ZgUniRegExpRule,
        regExpRules: ZgUniRuleRegExpItem[],
        forZg: boolean,
        result: ZgUniDetectResult): void {
        const inputLength = input.length;
        for (const ruleItem of regExpRules) {
            if ((!ruleItem.minInputLength || inputLength >= ruleItem.minInputLength) &&
                (!ruleItem.maxInputLength || ruleItem.maxInputLength < 1 || inputLength <= ruleItem.maxInputLength)) {
                let m: RegExpExecArray | null;
                // tslint:disable-next-line: no-conditional-assignment
                while ((m = ruleItem.testRegExp.exec(input)) != null) {
                    const start = m.index;
                    const matchedStr = m[0];
                    const end = start + matchedStr.length;

                    const strToCheck = input.substr(start);

                    let shouldIgnore = false;
                    if (strToCheck && ruleItem.excludeRegExps && ruleItem.excludeRegExps.length > 0) {
                        for (const excludeRule of ruleItem.excludeRegExps) {
                            if (excludeRule.test(strToCheck)) {
                                shouldIgnore = true;
                                break;
                            }
                        }
                    }

                    if (shouldIgnore) {
                        continue;
                    }

                    if (strToCheck && forZg && ruleItem.excludeUniPahsinWords) {
                        for (const pahsinWord of rule.uniPahsinWords) {
                            if (strToCheck.startsWith(pahsinWord)) {
                                shouldIgnore = true;
                                break;
                            }
                        }
                    }

                    if (shouldIgnore) {
                        continue;
                    }

                    if (forZg) {
                        result.zgMatches.push({
                            start,
                            end,
                            matchedStr,
                            test: ruleItem.test,
                            testDescription: ruleItem.description
                        });
                    } else {
                        result.uniMatches.push({
                            start,
                            end,
                            matchedStr,
                            test: ruleItem.test,
                            testDescription: ruleItem.description
                        });
                    }

                }
            }
        }
    }

    private constructAndCacheRule(rule: ZgUniRule): void {
        const zgRegExpRules = this.mapToZgUniRuleRegExpItems(rule.zgRules || []);
        const uniRegExpRules = this.mapToZgUniRuleRegExpItems(rule.uniRules || []);
        this.setCachedRule({
            ...rule,
            zgRegExpRules,
            uniRegExpRules
        });
    }

    private mapToZgUniRuleRegExpItems(ruleItems: ZgUniRuleItem[]): ZgUniRuleRegExpItem[] {
        return ruleItems.map(ruleItem => {
            let excludeRegExps: RegExp[] | undefined;
            if (ruleItem.excludes) {
                excludeRegExps = ruleItem.excludes.map(p => new RegExp(`^${p}`, 'g'));
            }

            return {
                ...ruleItem,
                testRegExp: new RegExp(ruleItem.test, 'g'),
                excludeRegExps
            };
        });
    }

    private setCachedRule(rule: ZgUniRegExpRule): void {
        if (this._options.shareCachedRules && this._ruleStore) {
            this._ruleStore.rule = rule;
        } else {
            this._cachedRule = rule;
        }
    }
}
