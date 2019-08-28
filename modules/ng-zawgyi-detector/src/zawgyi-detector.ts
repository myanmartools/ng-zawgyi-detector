/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { DetectedEnc, DetectorMatch, DetectorResult } from './detector-result';

export interface ZawgyiDetectorOptions {
    includeMatchedStringInResult?: boolean;
    zgUniSeparator?: RegExp;
}

export const ZAWGYI_DETECTOR_OPTIONS = new InjectionToken<ZawgyiDetectorOptions>('ZawgyiDetectorOptions');

// Zg
// const rSp = ' \u00A0\u1680\u2000-\u200D\u202F\u205F\u2060\u3000\uFEFF';
// const rZg3b = '\u103B\u107E-\u1084';
// const rZgUpC = '\u1000-\u1021\u1023-\u1027\u1029\u102A\u1040-\u1049\u104C-\u104F\u106A\u106B\u1086\u108F\u1090';
// const rZgPsLoC = '\u1060-\u1063\u1065-\u1069\u106C\u106D\u1070-\u107C\u1085\u1093\u1096';
// const rZgPsSgC = '\u106E\u106F\u1091\u1092\u1097';
// const rZgAcAfC = '\u102B-\u1030\u1032-\u1034\u1036-\u103A\u103C\u103D\u105A\u107D\u1087-\u108A\u108E\u1094\u1095';
// const rZgAcKsAfC = '\u1064\u108B-\u108D';

// const rZgPsDbG = `[${rZgUpC}][${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*[${rSp}]*[${rZgPsLoC}]`;
// const rZgPsDbAndOpG = `${rZgPsDbG}[${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*`;
// const rZgPsSgAndOpG = `[${rZgPsSgC}][${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*`;
// const rZgCAndOpG = `[${rZgUpC}][${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*`;

// Uni
const rUniC = '\u1000-\u102A\u103F\u1040-\u1049\u104C-\u104F';
const rUniPsUpC = '\u1000-\u102A\u103F\u1040-\u1049';
const rUniPsLoC = '\u1000-\u101C\u101E-\u1022\u1027\u103F';
const rUniAcAf31 = '[\u102D\u102E]?[\u102F\u1030]?[\u102B\u102C]?\u103A?[\u1032\u1036]?[\u102B\u102C]?\u103A?\u1037?[\u102B\u102C]?\u103A?\u1038?';
const rUniC1Bf3a = '\u1000-\u1023\u1025\u1027\u103F\u1040\u1044\u104E';
const rCBf3a = '\u1000\u1004\u1005\u1007\u1009\u100A\u100F\u1010\u1012\u1014\u1015\u1019\u101A\u101D\u101F\u1025';

/**
 * Zawgyi-One and standard Myanmar Unicode detection service.
 */
@Injectable()
export class ZawgyiDetector {
    private readonly _options: ZawgyiDetectorOptions = {
        includeMatchedStringInResult: true,
        zgUniSeparator: /[#\*\(\[\{\'\"<\u104A\u104B]?[ ]?(zawgyi|unicode|zg|uni|(\u101A\u1030\u1014\u102D?\u102E\u1000\u102F[\u1010\u1012][\u1039\u103A])|(\u1007\u1031\u102C\u103A\u1002\u103B\u102E)|(\u1031\u1007\u102C\u1039\u1002\u103A\u102D?\u102E))[^\u1000-\uAA7F]*(\u1017\u102C\u1038[\u101B\u1090][\u103D\u103E]\u1004[\u1039\u103A]\u1038)?[\u104A\u104B]?[^\u1000-\uAA7F]*[\u104A\u104B]?[\r\n]+$/gi
    };

    private readonly _allAcAnd60To97RegExp = new RegExp('^[\u102B-\u103E\u105A\u1060-\u1097]');

    // Zg
    // private readonly _zg31Or3bStartWOptionalSpRegExp = new RegExp(`^[${rSp}]*[\u1031${rZg3b}]+`);
    // private readonly _zg31AndOptional3bWPahsinRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgPsDbAndOpG}`);
    // private readonly _zg31AndOptional3bWPahsinSingleRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgPsSgAndOpG}`);
    // private readonly _zg31AndOptional3bWCRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgCAndOpG}`);
    // private readonly _zg3bWPahsinRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*${rZgPsDbAndOpG}`);
    // private readonly _zg3bWPahsinSingleRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*${rZgPsSgAndOpG}`);
    // private readonly _zg3bWCRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*${rZgCAndOpG}`);
    // private readonly _zgPahsinRegExp = new RegExp(`^${rZgPsDbAndOpG}`);
    // private readonly _zgPahsinSingleRegExp = new RegExp(`^${rZgPsSgAndOpG}`);
    // private readonly _zgCAndOptionalRegExp = new RegExp(`^${rZgCAndOpG}`);
    // private readonly _zgOnlyAcRegExp = new RegExp(`[${rZgAcKsAfC}\u1033\u1034\u105A\u107D-\u1084\u1087-\u108E\u1094\u1095]`);
    // private readonly _zgOnlyAc2bOr2cCbRegExp = new RegExp('[\u102B\u102C]\u1039');
    // private readonly _zgOnlyAc2dOr2eCbRegExp = new RegExp('[\u102D\u102E][\u1033\u1034\u103A\u103C\u103D]');
    // private readonly _zgOnlyAc2fOr30CbRegExp = new RegExp('[\u102F\u1030\u1033\u1034][\u102D\u102E\u1039\u103C\u103D]');
    // private readonly _zgOnlyAc32Or36CbRegExp = new RegExp('[\u1032\u1036][\u102D-\u1030\u1033\u1034\u103A\u103C\u103D]');
    // private readonly _zgOnlyAc37CbRegExp = new RegExp('\u1037[\u102D\u102E\u1032\u1036\u1039\u103C\u103D]');
    // private readonly _zgOnlyAc39CbRegExp = new RegExp('\u1039[\u102B\u102C\u102F\u1030\u1037\u1038\u103A\u103C\u103D]');
    // private readonly _zgOnlyAc3ACbRegExp = new RegExp('\u103A[\u102B-\u102E\u1032-\u1034\u1036\u1039\u103C\u103D]');
    // private readonly _zgAllAcAfCRegExp = new RegExp(`^[${rZgAcAfC}${rZgAcKsAfC}]`);

    // Uni
    private readonly _uniKsAndPsRegExp = new RegExp(`^\u1004\u103A\u1039[${rUniPsUpC}]\u1039[${rUniPsLoC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31}`);
    private readonly _uniKsAndCRegExp = new RegExp(`^\u1004\u103A\u1039[${rUniC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31}`);
    private readonly _uniPsRegExp = new RegExp(`^[${rUniPsUpC}]\u1039[${rUniPsLoC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31}`);
    private readonly _uniPsLeftEndRegExp = new RegExp(`[${rUniC}]\u103B?\u103C?[\u103D\u103E]?\u1031?\u102D?\u102F?[\u102B\u102C]?$`);
    private readonly _uniCAndOptionalRegExp = new RegExp(`^[${rUniC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31}`);
    private readonly _uniCC3aRegExp = new RegExp(`^[${rUniC1Bf3a}][\u103B\u103C]?[\u103D\u103E]?[\u102D\u102E]?[\u102F\u1030]?[${rCBf3a}]\u103A[\u1037\u1038]?`);
    private readonly _uniPsC3aRegExp = new RegExp(`^[${rUniPsUpC}]\u1039[${rUniC1Bf3a}][\u103B\u103C]?[\u103D\u103E]?[\u102D\u102E]?[\u102F\u1030]?[${rCBf3a}]\u103A[\u1037\u1038]?`);
    private readonly _uniC312cC3aRegExp = new RegExp(`^[${rUniC1Bf3a}][\u103B\u103C]?\u103E?\u1031[\u102B\u102C][${rCBf3a}]\u103A[\u1037\u1038]?`);
    private readonly _uniPs312cC3aRegExp = new RegExp(`^[${rUniPsUpC}]\u1039[${rUniC1Bf3a}][\u103B\u103C]?\u103E?\u1031[\u102B\u102C][${rCBf3a}]\u103A[\u1037\u1038]?`);

    constructor(@Optional() @Inject(ZAWGYI_DETECTOR_OPTIONS) options?: ZawgyiDetectorOptions) {
        if (options) {
            this._options = { ...this._options, ...options };
        }
    }

    /**
     * The main method to detect between Zawgyi-One and standard Myanmar Unicode.
     * @param input Input string to detect.
     * @returns Returns the result object.
     */
    detect(input: string): DetectorResult {
        const startTime = +new Date();
        const result: DetectorResult = {
            detectedEnc: null,
            duration: 0,
            matches: []
        };

        if (!input || !input.length || !input.trim().length) {
            return result;
        }

        let curStr = input;
        let curStart = 0;
        let matchedStr = '';
        let lastEnc: DetectedEnc = null;
        let zgProbability = 0;
        let uniProbability = 0;

        while (curStr.length > 0) {
            let d: DetectorMatch | null = null;
            // if (this._zg31Or3bStartWOptionalSpRegExp.test(curStr)) {
            //     d = this.detectZgMax(curStr, lastEnc, matchedStr);
            // }

            if (d == null) {
                const ud = this.detectUniMax(curStr, lastEnc, matchedStr);
                // const zd = this.detectZgMax(curStr, lastEnc, matchedStr);

                // if (ud != null && zd != null) {
                //     d = zd.probability > ud.probability ? zd : ud;
                // } else if (ud != null) {
                //     d = ud;
                // } else if (zd != null) {
                //     d = zd;
                // }

                d = ud;
            }

            if (d != null) {
                if (d.detectedEnc === 'zg') {
                    zgProbability += d.probability;
                } else {
                    uniProbability += d.probability;
                }
            }

            if (d != null) {
                result.matches.push({
                    detectedEnc: d.detectedEnc,
                    probability: d.probability,
                    start: curStart,
                    length: d.length,
                    matchedString: this._options.includeMatchedStringInResult ? d.matchedString : undefined
                });

                lastEnc = d.detectedEnc;
                matchedStr += d.matchedString;
                curStart += d.length;
                curStr = curStr.substring(d.length);
            } else {
                result.matches.push({
                    detectedEnc: null,
                    probability: 0,
                    start: curStart,
                    length: curStr.length,
                    matchedString: this._options.includeMatchedStringInResult ? curStr : undefined
                });

                break;
            }
        }

        if (zgProbability > 0 && uniProbability > 0) {
            result.detectedEnc = 'mix';
        } else if (zgProbability > 0) {
            result.detectedEnc = 'zg';
        } else if (uniProbability > 0) {
            result.detectedEnc = 'uni';
        }

        result.duration = Math.max(+new Date() - startTime, 0);

        return result;
    }

    // private detectZgMax(curStr: string, lastEnc: DetectedEnc, matchedStr: string): DetectorMatch | null {
    //     let curMatchedStr = '';
    //     let probabilitySum = 0;
    //     let totoalMatchedCount = 0;

    //     while (curStr.length > 0) {
    //         let d = this.detectZg31Start(curStr, lastEnc);

    //         if (d == null) {
    //             d = this.detectZg3bStart(curStr, lastEnc);
    //         }

    //         if (d == null) {
    //             d = this.detectZgPahsinAndOptional(curStr, lastEnc);
    //         }

    //         if (d == null) {
    //             d = this.detectZgCAndOptional(curStr, lastEnc, curMatchedStr);
    //         }

    //         if (d == null) {
    //             if (matchedStr.length === 0 || lastEnc == null) {
    //                 d = this.detectAcPrefixAndOutsideUnicodeBlock(curStr);
    //             } else {
    //                 d = this.detectOutsideUnicodeBlock(curStr);
    //             }
    //         }

    //         if (d == null || !d.curMatchedStr) {
    //             break;
    //         }

    //         curMatchedStr += d.curMatchedStr;
    //         lastEnc = d.detectedEnc;
    //         curStr = curStr.substring(d.curMatchedStr.length);

    //         if (d.probability > 0) {
    //             probabilitySum += d.probability;
    //             totoalMatchedCount++;
    //         }
    //     }

    //     if (!curMatchedStr.length) {
    //         return null;
    //     }

    //     const probability = totoalMatchedCount > 0 ? probabilitySum / totoalMatchedCount : 0;

    //     return {
    //         detectedEnc: 'zg',
    //         probability,
    //         start: -1,
    //         length: curMatchedStr.length,
    //         curMatchedStr
    //     };
    // }

    // private detectZg31Start(curStr: string, lastEnc: DetectedEnc): DetectorMatch | null {
    //     if (curStr[0] !== '\u1031') {
    //         return null;
    //     }

    //     if (curStr.length === 1) {
    //         return null;
    //     }

    //     let probability = 0;
    //     let curMatchedStr = '';

    //     if (curStr.length >= 3) {
    //         const m = curStr.match(this._zg31AndOptional3bWPahsinRegExp);
    //         if (m != null) {
    //             curMatchedStr = m[0];
    //             if (lastEnc === 'zg') {
    //                 probability = curMatchedStr.length === curStr.length ? 0.95 : 0.9;
    //             } else {
    //                 probability = 0.7;
    //             }

    //         }
    //     }

    //     if (!curMatchedStr.length) {
    //         const m = curStr.match(this._zg31AndOptional3bWPahsinSingleRegExp);
    //         if (m != null) {
    //             curMatchedStr = m[0];
    //             probability = curMatchedStr.length === curStr.length ? 0.95 : 0.9;
    //         }
    //     }

    //     if (!curMatchedStr.length) {
    //         const m = curStr.match(this._zg31AndOptional3bWCRegExp);
    //         if (m != null) {
    //             curMatchedStr = m[0];
    //             if (lastEnc === 'zg') {
    //                 probability = curMatchedStr.length === curStr.length ? 0.9 : 0.6;
    //             } else {
    //                 probability = 0.55;
    //             }
    //         }
    //     }

    //     if (!curMatchedStr.length) {
    //         return null;
    //     }

    //     return {
    //         detectedEnc: 'zg',
    //         probability,
    //         start: -1,
    //         length: curMatchedStr.length,
    //         curMatchedStr
    //     };
    // }

    // private detectZg3bStart(curStr: string, lastEnc: DetectedEnc): DetectorMatch | null {
    //     const c = curStr[0];

    //     if (c !== '\u103B' && c !== '\u107E' && c !== '\u107F' && c !== '\u1080' &&
    //         c !== '\u1081' && c !== '\u1082' && c !== '\u1083' && c !== '\u1084') {
    //         return null;
    //     }

    //     if (curStr.length === 1) {
    //         return null;
    //     }

    //     let probability = 0;
    //     let curMatchedStr = '';

    //     if (curStr.length >= 3) {
    //         const m = curStr.match(this._zg3bWPahsinRegExp);
    //         if (m != null) {
    //             curMatchedStr = m[0];
    //             if (lastEnc === 'zg') {
    //                 probability = curMatchedStr.length === curStr.length ? 0.95 : 0.9;
    //             } else {
    //                 probability = 0.7;
    //             }
    //         }
    //     }

    //     if (!curMatchedStr.length) {
    //         const m = curStr.match(this._zg3bWPahsinSingleRegExp);
    //         if (m != null) {
    //             curMatchedStr = m[0];
    //             probability = curMatchedStr.length === curStr.length ? 0.95 : 0.9;
    //         }
    //     }

    //     if (!curMatchedStr.length) {
    //         const m = curStr.match(this._zg3bWCRegExp);
    //         if (m != null) {
    //             curMatchedStr = m[0];
    //             if (lastEnc === 'zg') {
    //                 probability = curMatchedStr.length === curStr.length || c !== '\u103B' ? 0.9 : 0.6;
    //             } else {
    //                 probability = c !== '\u103B' ? 0.85 : 0.55;
    //             }
    //         }
    //     }

    //     if (!curMatchedStr.length) {
    //         return null;
    //     }

    //     return {
    //         detectedEnc: 'zg',
    //         probability,
    //         start: -1,
    //         length: curMatchedStr.length,
    //         curMatchedStr
    //     };
    // }

    // private detectZgPahsinAndOptional(curStr: string, lastEnc: DetectedEnc): DetectorMatch | null {
    //     let probability = 0;
    //     let curMatchedStr = '';

    //     if (curStr.length >= 2) {
    //         const m = curStr.match(this._zgPahsinRegExp);
    //         if (m != null) {
    //             curMatchedStr = m[0];
    //             if (lastEnc === 'zg') {
    //                 probability = curMatchedStr.length === curStr.length ? 0.95 : 0.9;
    //             } else {
    //                 probability = 0.7;
    //             }
    //         }
    //     }

    //     if (curMatchedStr.length === 0) {
    //         const m = curStr.match(this._zgPahsinSingleRegExp);
    //         if (m != null) {
    //             curMatchedStr = m[0];
    //             probability = curMatchedStr.length === curStr.length ? 0.95 : 0.9;
    //         }
    //     }

    //     if (curMatchedStr.length === 0) {
    //         return null;
    //     }

    //     return {
    //         detectedEnc: 'zg',
    //         probability,
    //         start: -1,
    //         length: curMatchedStr.length,
    //         curMatchedStr
    //     };
    // }

    // private detectZgCAndOptional(curStr: string, lastEnc: DetectedEnc, matchedStr: string): DetectorMatch | null {
    //     if (lastEnc !== 'zg') {
    //         let isZgStart = false;
    //         const cp = curStr.codePointAt(0);
    //         if (cp && ((cp >= 0x1000 && cp <= 0x1021) ||
    //             (cp >= 0x1023 && cp <= 0x1027) ||
    //             (cp >= 0x1029 && cp <= 0x102A) ||
    //             (cp >= 0x1040 && cp <= 0x1049) ||
    //             (cp >= 0x104C && cp <= 0x104F) ||
    //             (cp >= 0x106A && cp <= 0x106B) ||
    //             cp === 0x1086 || cp === 0x108F || cp === 0x1090)) {
    //             isZgStart = true;
    //         }
    //         if (!isZgStart) {
    //             return null;
    //         }
    //     }

    //     const m = curStr.match(this._zgCAndOptionalRegExp);
    //     if (m == null) {
    //         return null;
    //     }

    //     const curMatchedStr = m[0];
    //     let probability = 0;

    //     if (curMatchedStr.length > 1 && this._zgOnlyAcRegExp.test(curMatchedStr)) {
    //         probability = 0.9;
    //     } else if (curMatchedStr.length > 2 && (this._zgOnlyAc2bOr2cCbRegExp.test(curMatchedStr) ||
    //         this._zgOnlyAc2dOr2eCbRegExp.test(curMatchedStr) || this._zgOnlyAc2fOr30CbRegExp.test(curMatchedStr) ||
    //         this._zgOnlyAc32Or36CbRegExp.test(curMatchedStr) || this._zgOnlyAc39CbRegExp.test(curMatchedStr) ||
    //         this._zgOnlyAc37CbRegExp.test(curMatchedStr) || this._zgOnlyAc3ACbRegExp.test(curMatchedStr))) {
    //         probability = lastEnc === 'zg' ? 0.85 : 0.75;
    //     } else {
    //         if (curMatchedStr.length > 2) {
    //             probability = lastEnc === 'zg' ? 0.6 : 0.5;
    //         } if (curMatchedStr.length > 1) {
    //             probability = lastEnc === 'zg' ? 0.55 : 0.5;
    //         } else {
    //             probability = lastEnc === 'zg' ? 0.525 : 0.5;
    //         }
    //     }

    //     if (curMatchedStr.length === 0) {
    //         return null;
    //     }

    //     return {
    //         detectedEnc: 'zg',
    //         probability,
    //         start: -1,
    //         length: curMatchedStr.length,
    //         curMatchedStr
    //     };
    // }

    // private detectOtherCharsNonUni(curStr: string): DetectorMatch | null {
    //     let curMatchedStr = '';

    //     for (const c of curStr) {
    //         const cp = c.codePointAt(0);
    //         if (cp && (cp === 0x1022 || cp === 0x1028 || cp === 0x1035 || cp === 0x103E || cp === 0x103F ||
    //             (cp >= 0x1050 && cp <= 0x1059) || (cp >= 0x105B && cp <= 0x105F) || (cp >= 0x1098 && cp <= 0x109F) ||
    //             (cp >= 0xA9E0 && cp <= 0xA9FF) || (cp >= 0xAA60 && cp <= 0xAA7F))) {
    //             break;
    //         } else {
    //             curMatchedStr += c;
    //         }
    //     }

    //     if (!curMatchedStr.length) {
    //         return null;
    //     }

    //     return {
    //         detectedEnc: null,
    //         probability: 0,
    //         start: -1,
    //         length: curMatchedStr.length,
    //         curMatchedStr
    //     };
    // }

    private detectUniMax(curStr: string, lastEnc: DetectedEnc, matchedStr: string): DetectorMatch | null {
        let curMatchedStr = '';
        // let probabilitySum = 0;
        // let totoalMatchedCount = 0;
        let accProb = 0;
        let hasGreatProb = false;

        while (curStr.length > 0) {
            let d: DetectorMatch | null = null;

            d = this.detectUniKinsi(curStr, lastEnc, matchedStr + curMatchedStr, hasGreatProb);

            if (d == null) {
                d = this.detectUniPahsin(curStr, lastEnc, matchedStr + curMatchedStr, hasGreatProb);
            }

            if (d == null) {
                d = this.detectUniC312cC3a(curStr, lastEnc, matchedStr + curMatchedStr, hasGreatProb);
            }

            if (d == null) {
                d = this.detectUniCC3a(curStr, lastEnc, matchedStr + curMatchedStr, hasGreatProb);
            }

            if (d == null) {
                d = this.detectUniCAndOptional(curStr, lastEnc, matchedStr + curMatchedStr, hasGreatProb, accProb);
            }

            if (d == null) {
                d = this.detectUniOnlyCodePoints(curStr);
            }

            if (d != null) {
                if (!hasGreatProb && d.probability >= 0.85) {
                    hasGreatProb = true;
                }
            } else {
                d = this.detectOtherChars(curStr, lastEnc, matchedStr + curMatchedStr);
            }

            if (d == null || !d.matchedString) {
                break;
            }

            curMatchedStr += d.matchedString;
            lastEnc = d.detectedEnc;
            curStr = curStr.substring(d.matchedString.length);

            if (d.probability > 0) {
                accProb = accProb === 0 ? d.probability : (accProb + d.probability) / 2;
            }
        }

        if (!curMatchedStr.length) {
            return null;
        }

        return {
            detectedEnc: accProb > 0 ? 'uni' : null,
            probability: accProb,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectUniKinsi(curStr: string, lastEnc: DetectedEnc, matchedStr: string, hasGreatProb: boolean): DetectorMatch | null {
        if (curStr.length < 3) {
            return null;
        }

        const c1 = curStr[0];
        const c2 = curStr[1];
        const c3 = curStr[2];

        if (c1 !== '\u1004' && c2 !== '\u103A' && c3 !== '\u1039') {
            return null;
        }

        let probability = 0;

        if (curStr.length === 3) {
            probability = matchedStr.length === 0 || lastEnc == null ? 0.6 : lastEnc === 'uni' ? 0.55 : 0.51;

            return {
                detectedEnc: 'uni',
                probability,
                start: -1,
                length: 3,
                matchedString: curStr
            };
        }

        let m: RegExpMatchArray | null = null;

        if (curStr.length >= 6 && curStr[4] === '\u1039') {
            // Kinsi + Pahsin
            m = curStr.match(this._uniKsAndPsRegExp);
        }

        if (m == null) {
            // Kinsi + C
            m = curStr.match(this._uniKsAndCRegExp);
        }

        if (m == null) {
            return null;
        }

        let curMatchedStr = m[0];

        const test3aStr = curStr.substring(3);
        let d = this.detectUniC312cC3a(
            test3aStr,
            lastEnc,
            `${matchedStr}\u1004\u103A\u1039`,
            hasGreatProb);
        if (d === null) {
            d = this.detectUniCC3a(
                test3aStr,
                lastEnc,
                `${matchedStr}\u1004\u103A\u1039`,
                hasGreatProb);
        }

        if (d != null && d.matchedString) {
            curMatchedStr = `\u1004\u103A\u1039${d.matchedString}`;
        }

        if ((matchedStr.length === 0 || lastEnc == null) && curMatchedStr.length === curStr.length) {
            probability = d != null ? 0.8 : 0.7;
        } else if (curMatchedStr.length === curStr.length) {
            if (d != null) {
                if (lastEnc === 'uni') {
                    probability = hasGreatProb ? 0.95 : 0.85;
                } else {
                    probability = hasGreatProb ? 0.75 : 0.7;
                }
            } else {
                probability = lastEnc === 'uni' ? 0.8 : 0.7;
            }
        } else {
            if (d != null) {
                probability = lastEnc === 'uni' ? 0.9 : 0.8;
            } else {
                const testStr = curStr.substring(curMatchedStr.length);
                if (testStr.length > 0 && this._allAcAnd60To97RegExp.test(testStr)) {
                    return null;
                }

                probability = lastEnc === 'uni' ? 0.65 : 0.55;
            }
        }

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectUniPahsin(
        curStr: string,
        lastEnc: DetectedEnc,
        matchedStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
        if (curStr.length < 3) {
            return null;
        }

        if (curStr[1] !== '\u1039' || lastEnc !== 'uni') {
            return null;
        }

        const m = curStr.match(this._uniPsRegExp);

        if (m == null) {
            return null;
        }

        let curMatchedStr = m[0];

        if (!this._uniPsLeftEndRegExp.test(matchedStr)) {
            return null;
        }
        let d = this.detectUniC312cC3a(curStr, lastEnc, matchedStr, hasGreatProb);
        if (d === null) {
            d = this.detectUniCC3a(curStr, lastEnc, matchedStr, hasGreatProb);
        }

        if (d != null && d.matchedString) {
            curMatchedStr = d.matchedString;
        }

        let probability = 0;

        if (matchedStr.length === 1) {
            probability = d != null ? 0.975 : 0.95;
        } else if (d != null) {
            probability = hasGreatProb ? 0.9 : 0.85;
        } else {
            probability = hasGreatProb ? 0.6 : 0.5;
        }

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectUniC312cC3a(
        curStr: string,
        lastEnc: DetectedEnc,
        matchedStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
        if (curStr.length < 5) {
            return null;
        }

        const iStart = curStr[1] === '\u1039' ? 3 : 1;
        const iLen = iStart + 3;
        let pos31 = 0;

        for (let i = iStart; i < iLen; i++) {
            if (curStr[i] === '\u1031') {
                pos31 = i;
                break;
            }
        }

        if (pos31 === 0 || (curStr[pos31 + 1] !== '\u102B' && curStr[pos31 + 1] !== '\u102C') || curStr[pos31 + 3] !== '\u103A') {
            return null;
        }

        const m = curStr[1] === '\u1039' ? curStr.match(this._uniPs312cC3aRegExp) : curStr.match(this._uniC312cC3aRegExp);
        if (m == null) {
            return null;
        }

        const curMatchedStr = m[0];
        let probability = 0;

        if ((matchedStr.length === 0 || lastEnc == null) && curMatchedStr.length === curStr.trim().length) {
            probability = 1;
        } else if (curMatchedStr.length === curStr.length) {
            if (lastEnc === 'uni') {
                probability = hasGreatProb ? 0.95 : 0.9;
            } else {
                probability = 0.85;
            }
        } else {
            const testStr = curStr.substring(curMatchedStr.length);
            if (testStr.length > 0 && this._allAcAnd60To97RegExp.test(testStr)) {
                return null;
            }

            if (lastEnc === 'uni') {
                probability = hasGreatProb ? 0.86 : 0.85;
            } else {
                probability = 0.81;
            }
        }

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectUniCC3a(
        curStr: string,
        lastEnc: DetectedEnc,
        matchedStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
        if (curStr.length < 3) {
            return null;
        }

        const iStart = curStr[1] === '\u1039' ? 4 : 2;
        const iLen = curStr.length > iStart + 5 ? iStart + 5 : curStr.length;
        let pos3a = 0;

        for (let i = iStart; i < iLen; i++) {
            if (curStr[i] === '\u103A') {
                pos3a = i;
                break;
            }
        }

        if (pos3a < 1) {
            return null;
        }

        const m = curStr[1] === '\u1039' ? curStr.match(this._uniPsC3aRegExp) : curStr.match(this._uniCC3aRegExp);

        if (m == null) {
            return null;
        }

        const curMatchedStr = m[0];
        const lastC = curMatchedStr[curMatchedStr.length - 1];
        let probability = 0;

        if (lastC === '\u1037' || lastC === '\u1038') {
            if ((matchedStr.length === 0 || lastEnc == null) && curMatchedStr.length === curStr.trim().length) {
                probability = 0.95;
            } else if (matchedStr.length === 0 || lastEnc == null) {
                probability = 0.85;
            } else if (curMatchedStr.length === curStr.trim().length) {
                probability = lastEnc === 'uni' || hasGreatProb ? 0.9 : 0.85;
            } else {
                probability = lastEnc === 'uni' || hasGreatProb ? 0.85 : 0.6;
            }
        } else {
            if ((matchedStr.length === 0 || lastEnc == null) && curMatchedStr.length === curStr.trim().length) {
                probability = hasGreatProb ? 0.6 : 0.55;
            } else if (curMatchedStr.length === curStr.trim().length) {
                if (lastEnc === 'uni') {
                    probability = hasGreatProb ? 0.53 : 0.52;
                } else {
                    probability = 0.5;
                }
            } else {
                const testStr = curStr.substring(curMatchedStr.length);
                if (testStr.length > 0 && this._allAcAnd60To97RegExp.test(testStr)) {
                    return null;
                }

                if (lastEnc === 'uni') {
                    probability = hasGreatProb ? 0.52 : 0.51;
                } else {
                    probability = 0.5;
                }
            }
        }

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectUniCAndOptional(
        curStr: string,
        lastEnc: DetectedEnc,
        matchedStr: string,
        hasGreatProb: boolean,
        accProb: number): DetectorMatch | null {
        if (lastEnc !== 'uni') {
            let isUniStart = false;
            const cp = curStr.codePointAt(0);
            if (cp && ((cp >= 0x1000 && cp <= 0x102A) ||
                cp === 0x103F ||
                (cp >= 0x1040 && cp <= 0x1049) ||
                (cp >= 0x104C && cp <= 0x104F))) {
                isUniStart = true;
            }
            if (!isUniStart) {
                return null;
            }
        }

        const m = curStr.match(this._uniCAndOptionalRegExp);
        if (m == null) {
            return null;
        }

        const curMatchedStr = m[0];
        let probability = 0;

        if (this.isUniOnlyCodePoint(curMatchedStr.codePointAt(0))) {
            probability = 1;
        } else {
            if (curStr.length > 1) {
                // TODO: to test
                const testStr = curStr.substring(curMatchedStr.length);
                if (testStr.length > 0 && this._allAcAnd60To97RegExp.test(testStr)) {
                    return null;
                }
            }

            if ((matchedStr.length === 0 || lastEnc == null) && curMatchedStr.length === curStr.trim().length) {
                if (curMatchedStr.includes('\u1031') || curMatchedStr.includes('\u103B')) {
                    probability = 1;
                } else {
                    probability = curMatchedStr.length > 2 ? 0.57 : curMatchedStr.length > 1 ? 0.56 : 0.55;
                }
            } else {
                if (lastEnc === 'uni') {
                    if (curMatchedStr.length === curStr.trim().length && (curMatchedStr.includes('\u1031') || curMatchedStr.includes('\u103B'))) {
                        probability = accProb === 1 ? 1 : hasGreatProb ? 0.9 : 0.85;
                    } else if (hasGreatProb) {
                        if (curMatchedStr.includes('\u1031') || curMatchedStr.includes('\u103B')) {
                            probability = 0.6;
                        } else {
                            probability = curMatchedStr.length > 2 ? 0.56 : curMatchedStr.length > 1 ? 0.55 : 0.54;
                        }
                    } else {
                        probability = curMatchedStr.length > 2 ? 0.53 : curMatchedStr.length > 1 ? 0.52 : 0.51;
                    }
                } else {
                    if ((matchedStr.length === 0 || lastEnc == null) &&
                        (curMatchedStr.includes('\u1031') || curMatchedStr.includes('\u103B'))) {
                        probability = 0.55;
                    } else {
                        probability = 0.5;
                    }
                }
            }
        }

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectUniOnlyCodePoints(curStr: string): DetectorMatch | null {
        let curMatchedStr = '';

        for (const c of curStr) {
            const cp = c.codePointAt(0);
            if (this.isUniOnlyCodePoint(cp)) {
                curMatchedStr += c;
            } else {
                break;
            }
        }

        if (!curMatchedStr.length) {
            return null;
        }

        return {
            detectedEnc: 'uni',
            probability: 1,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectOtherChars(curStr: string, lastEnc: DetectedEnc, matchedStr: string): DetectorMatch | null {
        let curMatchedStr = '';
        let hasPunctuation = false;

        for (const c of curStr) {
            if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
                curMatchedStr += c;
                continue;
            }

            const cp = c.codePointAt(0);

            if (cp == null) {
                curMatchedStr += c;
                continue;
            }

            if (cp === 0x104A || cp === 0x104B) {
                hasPunctuation = true;
                curMatchedStr += c;
                continue;
            }

            if ((cp >= 0x1000 && cp <= 0x109F) || (cp >= 0xA9E0 && cp <= 0xA9FF) || (cp >= 0xAA60 && cp <= 0xAA7F)) {
                break;
            }

            curMatchedStr += c;
        }

        if (!curMatchedStr.length) {
            return null;
        }

        return {
            detectedEnc: null,
            probability: matchedStr.length > 0 && lastEnc != null ? 1 : hasPunctuation ? 0.5 : 0,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private isUniOnlyCodePoint(cp?: number): boolean {
        if (cp && (cp === 0x1022 || cp === 0x1028 || cp === 0x1035 || cp === 0x103E || cp === 0x103F ||
            (cp >= 0x1050 && cp <= 0x1059) || (cp >= 0x105B && cp <= 0x105F) || (cp >= 0x1098 && cp <= 0x109F) ||
            (cp >= 0xA9E0 && cp <= 0xA9FF) || (cp >= 0xAA60 && cp <= 0xAA7F))) {
            return true;
        }

        return false;
    }
}
