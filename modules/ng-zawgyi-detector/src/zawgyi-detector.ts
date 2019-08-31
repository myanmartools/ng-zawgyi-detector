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
    preferZg?: boolean;
}

export const ZAWGYI_DETECTOR_OPTIONS = new InjectionToken<ZawgyiDetectorOptions>('ZawgyiDetectorOptions');

const rCForAThat = '\u1000-\u1002\u1004\u1005\u1007\u1009\u100A\u100B\u100C\u100F\u1010\u1012\u1014-\u101F\u1020\u1025';

// Zg
const rSp = ' \u00A0\u1680\u2000-\u200D\u202F\u205F\u2060\u3000\uFEFF';
const rZg3b = '\u103B\u107E-\u1084';
const rZgUpC = '\u1000-\u1021\u1023-\u1027\u1029\u102A\u1040-\u1049\u104C-\u104F\u106A\u106B\u1086\u108F\u1090';

const rZgPsLoC = '\u1060-\u1063\u1065-\u1069\u106C\u106D\u1070-\u107C\u1085\u1093\u1096';
const rZgPsSgC = '\u106E\u106F\u1091\u1092\u1097';
const rZgAcAfC = '\u102B-\u1030\u1032-\u1034\u1036-\u103A\u103C\u103D\u105A\u107D\u1087-\u108A\u108E\u1094\u1095';
const rZgAcKsAfC = '\u1064\u108B-\u108E';

const rZgPsDbG = `[${rZgUpC}][${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*[${rSp}]*[${rZgPsLoC}]`;

const rZgCAndOpG = `[${rZgUpC}][${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*`;

const rZgPsSgAndOpG = `[${rZgPsSgC}][${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*`;
const rZgPsDbAndOpG = `${rZgPsDbG}[${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*`;

const rZgCAndAThat = `[${rCForAThat}](\u1039\u1038|\u1039\u1037|\u1037\u1039|\u1039)`;

const rZgC1For3a = '\u1000-\u1021\u1023\u1025\u1027\u1040\u1044\u106A\u106B\u1086\u108F\u1090';

const rZgOnlyCAndAcAfC = `${rZgAcKsAfC}\u1033\u1034\u105A\u106A\u106B\u107D\u1086-\u108A\u108F\u1090\u1094\u1095`;

// Uni
const rUniC = '\u1000-\u102A\u103F\u1040-\u1049\u104C-\u104F';
const rUniPsUpC = '\u1000-\u102A\u103F\u1040-\u1049';
const rUniPsLoC = '\u1000-\u101C\u101E-\u1022\u1027\u103F';
const rUniAcAf31 = '[\u102D\u102E]?[\u102F\u1030]?[\u102B\u102C]?\u103A?[\u1032\u1036]?[\u102B\u102C]?\u103A?\u1037?[\u102B\u102C]?\u103A?\u1038?';
const rUniC1Bf3a = '\u1000-\u1023\u1025\u1027\u103F\u1040\u1044\u104E';

/**
 * Zawgyi-One and standard Myanmar Unicode detection service.
 */
@Injectable()
export class ZawgyiDetector {
    private readonly _options: ZawgyiDetectorOptions = {
        includeMatchedStringInResult: true,
        zgUniSeparator: /[#\*\(\[\{\'\"<\u104A\u104B]?[ ]?(zawgyi|unicode|zg|uni|(\u101A\u1030\u1014\u102D?\u102E\u1000\u102F[\u1010\u1012][\u1039\u103A])|(\u1007\u1031\u102C\u103A\u1002\u103B\u102E)|(\u1031\u1007\u102C\u1039\u1002\u103A\u102D?\u102E))[^\u1000-\uAA7F]*(\u1017\u102C\u1038[\u101B\u1090][\u103D\u103E]\u1004[\u1039\u103A]\u1038)?[\u104A\u104B]?[^\u1000-\uAA7F]*[\u104A\u104B]?[\r\n]+$/gi
    };

    // Zg
    private readonly _zgAllAcAfCRegExp = new RegExp(`^[${rZgAcAfC}${rZgAcKsAfC}]`);

    private readonly _zg31WCRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgCAndOpG}`);
    private readonly _zg31WCAndAThatRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*[${rZgC1For3a}][${rSp}]*[${rZgAcKsAfC}]*[\u102B\u102C]${rZgCAndAThat}`);
    private readonly _zg31WPahsinSgRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgPsSgAndOpG}`);
    private readonly _zg31WPahsinSgAndAThatRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*[${rZgPsSgC}][${rSp}]*[${rZgAcKsAfC}]*[\u102B\u102C]${rZgCAndAThat}`);
    private readonly _zg31WPahsinDbRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgPsDbAndOpG}`);
    private readonly _zg31WPahsinDbAndAThatRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgPsDbG}[${rSp}]*[${rZgAcKsAfC}]*[\u102B\u102C]${rZgCAndAThat}`);

    private readonly _zg3bWCRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*${rZgCAndOpG}`);
    private readonly _zg3bWCAndAThatRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*[${rZgC1For3a}][${rSp}]*[${rZgAcKsAfC}]*[\u102B\u102C]${rZgCAndAThat}`);

    private readonly _zg3bWPahsinSgRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*${rZgPsSgAndOpG}`);
    private readonly _zg3bWPahsinSgAndAThatRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*[${rZgPsSgC}][${rSp}]*[${rZgAcKsAfC}]*[\u102B\u102C]${rZgCAndAThat}`);

    private readonly _zg3bWPahsinDbRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*${rZgPsDbAndOpG}`);
    private readonly _zg3bWPahsinDbAndAThatRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]${rZgPsDbG}[${rSp}]*[${rZgAcKsAfC}]*[\u102B\u102C]${rZgCAndAThat}`);

    private readonly _zgPahsinDbRegExp = new RegExp(`^${rZgPsDbAndOpG}`);
    private readonly _zgPahsinSgRegExp = new RegExp(`^${rZgPsSgAndOpG}`);

    private readonly _zgCAndOptionalRegExp = new RegExp(`^${rZgCAndOpG}`);
    private readonly _zgCAndAThatRegExp = new RegExp(`^${rZgCAndAThat}`);

    private readonly _zgOnlyCAndAcAfCRegExp = new RegExp(`[${rZgOnlyCAndAcAfC}]`);
    private readonly _zgOnlyCAndAcAfCFor31Or3bRegExp = new RegExp(`[${rZgOnlyCAndAcAfC}\u107E-\u1084]`);

    private readonly _zgOnlyAc2bOr2cCbRegExp = new RegExp('[\u102B\u102C]\u1039');
    private readonly _zgOnlyAc2dOr2eCbRegExp = new RegExp('[\u102D\u102E][\u1033\u1034\u103A\u103C\u103D]');
    private readonly _zgOnlyAc2fOr30CbRegExp = new RegExp('[\u102F\u1030\u1033\u1034][\u102D\u102E\u1039\u103C\u103D]');
    private readonly _zgOnlyAc32Or36CbRegExp = new RegExp('[\u1032\u1036][\u102D-\u1030\u1033\u1034\u103A\u103C\u103D]');
    private readonly _zgOnlyAc37CbRegExp = new RegExp('\u1037[\u102D\u102E\u1032\u1036\u1039\u103C\u103D]');
    private readonly _zgOnlyAc39CbRegExp = new RegExp('\u1039[\u102B\u102C\u102F\u1030\u1037\u1038\u103A\u103C\u103D]');
    private readonly _zgOnlyAc3ACbRegExp = new RegExp('\u103A[\u102B-\u102E\u1032-\u1034\u1036\u1039\u103C\u103D]');
    private readonly _zgNotWith3aRegExp = new RegExp('[\u1003\u1004\u1006-\u1014\u1018\u101B\u101F-\u1021\u1023-\u1027\u1029\u102A]');

    private readonly _zgHasUniPsLoCRegExp = new RegExp(`^[${rUniPsLoC}]`);

    private readonly _zgCNotCompatWith3dOnlyRegExp = new RegExp('[\u1000-\u1003\u1005-\u1008\u100B-\u1013\u1018\u101E\u1020\u1021\u1023-\u1027\u1029\u102A]');

    // Uni
    private readonly _uniAllAcAnd60To97RegExp = new RegExp('^[\u102B-\u103E\u105A\u1060-\u1097]');
    private readonly _uniKsAndPsRegExp = new RegExp(`^\u1004\u103A\u1039[${rUniPsUpC}]\u1039[${rUniPsLoC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31}`);
    private readonly _uniKsAndCRegExp = new RegExp(`^\u1004\u103A\u1039[${rUniC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31}`);
    private readonly _uniPsRegExp = new RegExp(`^[${rUniPsUpC}]\u1039[${rUniPsLoC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31}`);
    private readonly _uniPsLeftEndRegExp = new RegExp(`[${rUniC}]\u103B?\u103C?[\u103D\u103E]?\u1031?\u102D?\u102F?[\u102B\u102C]?$`);

    private readonly _uniCAndOptionalRegExp = new RegExp(`^[${rUniC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31}`);

    private readonly _uniCC3aRegExp = new RegExp(`^[${rUniC1Bf3a}][\u103B\u103C]?[\u103D\u103E]?[\u102D\u102E]?[\u102F\u1030]?[\u102B\u102C]?[${rCForAThat}]\u103A[\u1037\u1038]?`);
    private readonly _uniPsC3aRegExp = new RegExp(`^[${rUniPsUpC}]\u1039[${rUniC1Bf3a}][\u103B\u103C]?[\u103D\u103E]?[\u102D\u102E]?[\u102F\u1030]?[\u102B\u102C]?[${rCForAThat}]\u103A[\u1037\u1038]?`);

    private readonly _uniC312cC3aRegExp = new RegExp(`^[${rUniC1Bf3a}][\u103B\u103C]?\u103E?\u1031[\u102B\u102C]?[${rCForAThat}]\u103A[\u1037\u1038]?`);

    private readonly _uniPs312cC3aRegExp = new RegExp(`^[${rUniPsUpC}]\u1039[${rUniC1Bf3a}][\u103B\u103C]?\u103E?\u1031[\u102B\u102C]?[${rCForAThat}]\u103A[\u1037\u1038]?`);
    private readonly _uniCAThatRegExp = new RegExp(`^[${rCForAThat}]\u103A`);

    // Probabilities
    private readonly _pZg31Or3b95 = 0.95;
    private readonly _pZg31Or3b85 = 0.85;
    private readonly _pZg31Or3b53 = 0.53;
    private readonly _pZg31Or3b50 = 0.5;

    private readonly _pZgPs95 = 0.95;
    private readonly _pZgPs90 = 0.9;

    private readonly _pUniKs95 = 0.95;
    private readonly _pUniKs85 = 0.85;
    private readonly _pUniKs80 = 0.8;
    private readonly _pUniKs75 = 0.75;
    private readonly _pUniKs60 = 0.6;

    private readonly _pUniPs95 = 0.95;
    private readonly _pUniPs50 = 0.5;

    private readonly _pAThat90 = 0.9;
    private readonly _pAThat85 = 0.85;
    private readonly _pAThat65 = 0.65;
    private readonly _pAThat55 = 0.55;
    private readonly _pAThat54 = 0.54;
    private readonly _pAThat53 = 0.53;
    private readonly _pAThat52 = 0.52;
    private readonly _pAThat51 = 0.51;
    private readonly _pAThat50 = 0.5;

    private readonly _pUniCMax = 1;
    private readonly _pC95 = 0.95;
    private readonly _pC85 = 0.85;
    private readonly _pC55 = 0.55;
    private readonly _pC54 = 0.54;
    private readonly _pC52 = 0.52;
    private readonly _pC50 = 0.5;
    private readonly _pC20 = 0.2;

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
    // tslint:disable-next-line: max-func-body-length
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
        let lastMatchedStr = '';
        let lastEnc: DetectedEnc = null;
        let zgProbability = 0;
        let uniProbability = 0;

        while (curStr.length > 0) {
            let zd: DetectorMatch | null = null;
            let ud: DetectorMatch | null = null;
            let zdChecked = false;

            const c = curStr.trim()[0];

            if (c === '\u1031' || c === '\u103B' || c === '\u107E' || c === '\u107F' || c === '\u1080' ||
                c === '\u1081' || c === '\u1082' || c === '\u1083' || c === '\u1084') {
                zd = this.detectZgMax(curStr, lastEnc, lastMatchedStr);
                zdChecked = true;
            }

            if (zd == null || zd.probability < 0.95 || !zd.matchedString || zd.matchedString.length !== curStr.length) {
                ud = this.detectUniMax(curStr, lastEnc, lastMatchedStr);
            }

            if (!zdChecked && (ud == null || ud.probability < 0.95 || !ud.matchedString || ud.matchedString.length !== curStr.length)) {
                zd = this.detectZgMax(curStr, lastEnc, lastMatchedStr);
            }

            let sd: DetectorMatch | null = null;
            let cd: DetectorMatch | null = null;

            if (ud != null && zd != null) {
                const diff = ud.probability - zd.probability;

                // || (!this._options.preferZg && diff > -0.0001 && diff < 0)
                if (diff === 0) {
                    if (zd.length === ud.length) {
                        sd = this._options.preferZg ? zd : ud;
                    } else if (zd.length > ud.length) {
                        sd = zd;
                    } else {
                        sd = ud;
                    }
                } else if (diff < 0) {
                    sd = zd;
                } else {
                    sd = ud;
                }
                cd = sd.detectedEnc === 'uni' ? zd : ud;
            } else if (ud != null) {
                sd = ud;
            } else if (zd != null) {
                sd = zd;
            }

            if (sd != null) {
                if (sd.detectedEnc === 'zg') {
                    zgProbability += sd.probability;
                } else {
                    uniProbability += sd.probability;
                }

                result.matches.push({
                    detectedEnc: sd.detectedEnc,
                    probability: sd.probability,
                    start: curStart,
                    length: sd.length,
                    matchedString: this._options.includeMatchedStringInResult ? sd.matchedString : undefined,
                    competitorMatch: cd != null ? cd : undefined
                });

                lastEnc = sd.detectedEnc;
                lastMatchedStr += sd.matchedString;
                curStart += sd.length;
                curStr = curStr.substring(sd.length);
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

    // Zawgyi
    //
    private detectZgMax(curStr: string, lastEnc: DetectedEnc, lastMatchedStr: string): DetectorMatch | null {
        let curMatchedStr = '';
        let accProb = 0;
        let hasGreatProb = false;

        while (curStr.length > 0) {
            let d = this.detectZg31Start(curStr, lastEnc, lastMatchedStr + curMatchedStr, hasGreatProb);

            if (d == null) {
                d = this.detectZg3bStart(curStr, lastEnc, lastMatchedStr + curMatchedStr, hasGreatProb);
            }

            if (d == null) {
                d = this.detectZgPahsin(curStr, lastEnc, lastMatchedStr + curMatchedStr, hasGreatProb);
            }

            if (d == null) {
                d = this.detectZgC(curStr, lastEnc, lastMatchedStr + curMatchedStr, hasGreatProb);
            }

            if (d != null) {
                if (!hasGreatProb && d.probability >= 0.85) {
                    hasGreatProb = true;
                }
            } else {
                d = this.detectOtherChars(curStr, lastEnc, lastMatchedStr + curMatchedStr);
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
            detectedEnc: accProb > 0 ? 'zg' : null,
            probability: accProb,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectZg31Start(
        curStr: string,
        lastEnc: DetectedEnc,
        lastMatchedStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
        if (curStr.length < 2) {
            return null;
        }

        if (curStr[0] !== '\u1031') {
            return null;
        }

        let curMatchedStr = '';
        let aThatMatched = false;
        let pahsinMatched = false;

        if (curStr.length >= 3) {
            const m = curStr.match(this._zg31WPahsinDbRegExp);
            if (m != null) {
                curMatchedStr = m[0];
                pahsinMatched = true;
                const lastC = curMatchedStr[curMatchedStr.length - 1];

                if (lastC === '\u102B' || lastC === '\u102C') {
                    const m2 = curStr.match(this._zg31WPahsinDbAndAThatRegExp);
                    if (m2 != null) {
                        curMatchedStr = m2[0];
                        aThatMatched = true;
                    }
                }
            }
        }

        if (!curMatchedStr.length) {
            const m = curStr.match(this._zg31WPahsinSgRegExp);
            if (m != null) {
                curMatchedStr = m[0];
                pahsinMatched = true;
                const lastC = curMatchedStr[curMatchedStr.length - 1];

                if (lastC === '\u102B' || lastC === '\u102C') {
                    const m2 = curStr.match(this._zg31WPahsinSgAndAThatRegExp);
                    if (m2 != null) {
                        curMatchedStr = m2[0];
                        aThatMatched = true;
                    }
                }
            }
        }

        if (!curMatchedStr.length) {
            const m = curStr.match(this._zg31WCRegExp);
            if (m != null) {
                curMatchedStr = m[0];
                const lastC = curMatchedStr[curMatchedStr.length - 1];
                if (lastC === '\u102B' || lastC === '\u102C') {
                    const m2 = curStr.match(this._zg31WCAndAThatRegExp);
                    if (m2 != null) {
                        curMatchedStr = m2[0];
                        aThatMatched = true;
                    }
                }
            }
        }

        if (!curMatchedStr.length) {
            return null;
        }

        const probability = this.getProbForZg31(curStr, lastEnc, lastMatchedStr, hasGreatProb, curMatchedStr, aThatMatched, pahsinMatched);

        return {
            detectedEnc: 'zg',
            probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectZg3bStart(
        curStr: string,
        lastEnc: DetectedEnc,
        lastMatchedStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
        if (curStr.length < 2) {
            return null;
        }

        const c = curStr[0];

        if (c !== '\u103B' && c !== '\u107E' && c !== '\u107F' && c !== '\u1080' &&
            c !== '\u1081' && c !== '\u1082' && c !== '\u1083' && c !== '\u1084') {
            return null;
        }

        let curMatchedStr = '';
        let pahsinMatched = false;
        let aThatMatched = false;

        if (curStr.length >= 3) {
            const m = curStr.match(this._zg3bWPahsinDbRegExp);
            if (m != null) {
                curMatchedStr = m[0];
                pahsinMatched = true;
                const lastC = curMatchedStr[curMatchedStr.length - 1];

                if (lastC === '\u102B' || lastC === '\u102C') {
                    const m2 = curStr.match(this._zg3bWPahsinDbAndAThatRegExp);
                    if (m2 != null) {
                        curMatchedStr = m2[0];
                        aThatMatched = true;
                    }
                }
            }
        }

        if (!curMatchedStr.length) {
            const m = curStr.match(this._zg3bWPahsinSgRegExp);
            if (m != null) {
                curMatchedStr = m[0];
                pahsinMatched = true;
                const lastC = curMatchedStr[curMatchedStr.length - 1];

                if (lastC === '\u102B' || lastC === '\u102C') {
                    const m2 = curStr.match(this._zg3bWPahsinSgAndAThatRegExp);
                    if (m2 != null) {
                        curMatchedStr = m2[0];
                        aThatMatched = true;
                    }
                }
            }
        }

        if (!curMatchedStr.length) {
            const m = curStr.match(this._zg3bWCRegExp);
            if (m != null) {
                curMatchedStr = m[0];
                const lastC = curMatchedStr[curMatchedStr.length - 1];

                if (lastC === '\u102B' || lastC === '\u102C') {
                    const m2 = curStr.match(this._zg3bWCAndAThatRegExp);
                    if (m2 != null) {
                        curMatchedStr = m2[0];
                        aThatMatched = true;
                    }
                }
            }
        }

        if (!curMatchedStr.length) {
            return null;
        }

        const probability = this.getProbForZg3b(curStr, lastEnc, lastMatchedStr, hasGreatProb, curMatchedStr, aThatMatched, pahsinMatched);

        return {
            detectedEnc: 'zg',
            probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectZgPahsin(
        curStr: string,
        lastEnc: DetectedEnc,
        lastMatchedStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
        let m: RegExpMatchArray | null = null;

        if (curStr.length > 1) {
            m = curStr.match(this._zgPahsinDbRegExp);
        }

        if (m == null) {
            m = curStr.match(this._zgPahsinSgRegExp);
        }

        if (m === null) {
            return null;
        }

        let curMatchedStr = m[0];
        let aThatMatched = false;

        if (curStr.trim().length >= curMatchedStr.length + 2 && !curMatchedStr.includes('\u1039')) {
            const testStr = curStr.substring(curMatchedStr.length);
            const d = this.detectZgAThatSufix(testStr);
            if (d != null && d.matchedString) {
                curMatchedStr += d.matchedString;
                aThatMatched = true;
            }
        }

        let probability: number;
        if (lastEnc === 'zg' || hasGreatProb || !lastMatchedStr.length ||
            lastEnc == null || curMatchedStr.length === curStr.trim().length || aThatMatched) {
            probability = this._pZgPs95;
        } else {
            probability = this._pZgPs90;
        }

        return {
            detectedEnc: 'zg',
            probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectZgC(
        curStr: string,
        lastEnc: DetectedEnc,
        lastMatchedStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
        if (lastEnc !== 'zg') {
            let isZgStart = false;
            const cp = curStr.codePointAt(0);
            if (cp && ((cp >= 0x1000 && cp <= 0x1021) ||
                (cp >= 0x1023 && cp <= 0x1027) ||
                (cp >= 0x1029 && cp <= 0x102A) ||
                (cp >= 0x1040 && cp <= 0x1049) ||
                (cp >= 0x104C && cp <= 0x104F) ||
                (cp >= 0x106A && cp <= 0x106B) ||
                cp === 0x1086 || cp === 0x108F || cp === 0x1090)) {
                isZgStart = true;
            }
            if (!isZgStart) {
                return null;
            }
        }

        const m = curStr.match(this._zgCAndOptionalRegExp);
        if (m == null) {
            return null;
        }

        let curMatchedStr = m[0];
        let aThatMatched = false;

        if (curStr.trim().length >= curMatchedStr.length + 2 && !curMatchedStr.includes('\u1039')) {
            const testStr = curStr.substring(curMatchedStr.length);
            const d = this.detectZgAThatSufix(testStr);
            if (d != null && d.matchedString) {
                curMatchedStr += d.matchedString;
                aThatMatched = true;
            }
        }

        let probability: number;
        const c = curMatchedStr[0];

        if (c === '\u104E' || c === '\u106A' || c === '\u106B' || c === '\u1086' || c === '\u108F' || c === '\u1090') {
            if (lastEnc === 'zg' || lastEnc == null || hasGreatProb ||
                !lastMatchedStr.length || curMatchedStr.length === curStr.trim().length) {
                probability = this._pC95;
            } else {
                probability = this._pC85;
            }
        } else if (curMatchedStr.includes('\u1039')) {
            probability = this.getProbForZgC39(curStr, lastEnc, lastMatchedStr, hasGreatProb, curMatchedStr, aThatMatched);
        } else if (curMatchedStr.includes('\u103A')) {
            probability = this.getProbForZgC3A(curStr, lastEnc, lastMatchedStr, hasGreatProb, curMatchedStr, aThatMatched);
        } else if (curMatchedStr.includes('\u103D')) {
            if (!curMatchedStr.includes('\u103C') && this._zgCNotCompatWith3dOnlyRegExp.test(curMatchedStr)) {
                probability = lastEnc === 'zg' && hasGreatProb ? this._pC50 : this._pC20;
            } else {
                probability = lastEnc === 'zg' && hasGreatProb ? this._pC54 : this._pC50;
            }
        } else if ((curMatchedStr.length > 1 && this._zgOnlyCAndAcAfCRegExp.test(curMatchedStr)) ||
            (this.containsZgOnlyAcCombine(curMatchedStr))) {
            probability = lastEnc === 'zg' && hasGreatProb ? this._pC95 : this._pC85;
        } else {
            if (lastEnc === 'zg' && hasGreatProb) {
                probability = this._pC54;
            } else {
                probability = this._pC50;
            }
        }

        return {
            detectedEnc: 'zg',
            probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectZgAThatSufix(curStr: string): DetectorMatch | null {
        const m = curStr.match(this._zgCAndAThatRegExp);
        if (m == null) {
            return null;
        }

        const curMatchedStr = m[0];
        if (curStr.trim().length > curMatchedStr.length) {
            const testAcStr = curStr.substring(curMatchedStr.length);
            if (this._zgAllAcAfCRegExp.test(testAcStr)) {
                return null;
            }
        }

        return {
            detectedEnc: 'zg',
            probability: -1,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private getProbForZg31(
        curStr: string,
        lastEnc: DetectedEnc,
        lastMatchedStr: string,
        hasGreatProb: boolean,
        curMatchedStr: string,
        aThatMatched: boolean,
        pahsinMatched: boolean): number {
        let probability: number;

        if ((!lastMatchedStr.length || lastEnc == null) && curMatchedStr.length === curStr.trim().length) {
            probability = this._pZg31Or3b95;
        } else if (!lastMatchedStr.length || lastEnc == null) {
            probability = this._pZg31Or3b85;
        } else if (curMatchedStr.length > 2 &&
            (this._zgOnlyCAndAcAfCFor31Or3bRegExp.test(curMatchedStr) || this.containsZgOnlyAcCombine(curMatchedStr))) {
            probability = this._pZg31Or3b95;
        } else if (pahsinMatched) {
            probability = this._pZg31Or3b95;
        } else if (curMatchedStr.length === curStr.trim().length && curMatchedStr.endsWith('\u1039')) {
            probability = this._pZg31Or3b95;
        } else if (aThatMatched || curMatchedStr.includes('\u1039')) {
            const c39Index = curMatchedStr.indexOf('\u1039');
            const testStr = c39Index === curMatchedStr.length - 1 ?
                curStr.substring(curMatchedStr.length) : curMatchedStr.substring(c39Index + 1);
            const cAf39 = testStr.length > 0 ? testStr[0] : '';

            if (cAf39.length && this._zgHasUniPsLoCRegExp.test(cAf39)) {
                probability = this._pZg31Or3b50;
            } else {
                probability = lastEnc === 'zg' && hasGreatProb ? this._pZg31Or3b53 : this._pZg31Or3b50;
            }
        } else {
            probability = this._pZg31Or3b50;
        }

        return probability;
    }

    private getProbForZg3b(
        curStr: string,
        lastEnc: DetectedEnc,
        lastMatchedStr: string,
        hasGreatProb: boolean,
        curMatchedStr: string,
        aThatMatched: boolean,
        pahsinMatched: boolean): number {
        let probability: number;

        if ((!lastMatchedStr.length || lastEnc == null) && curMatchedStr.length === curStr.trim().length) {
            probability = this._pZg31Or3b95;
        } else if (!lastMatchedStr.length || lastEnc == null) {
            probability = this._pZg31Or3b85;
        } else if (curMatchedStr.length > 2 &&
            (this._zgOnlyCAndAcAfCFor31Or3bRegExp.test(curMatchedStr) || this.containsZgOnlyAcCombine(curMatchedStr))) {
            probability = this._pZg31Or3b95;
        } else if (pahsinMatched) {
            probability = this._pZg31Or3b95;
        } else if (curMatchedStr.length === curStr.trim().length && curMatchedStr.endsWith('\u1039')) {
            probability = this._pZg31Or3b95;
        } else if (aThatMatched || curMatchedStr.includes('\u1039')) {
            const c39Index = curMatchedStr.indexOf('\u1039');
            const testStr = c39Index === curMatchedStr.length - 1 ?
                curStr.substring(curMatchedStr.length) : curMatchedStr.substring(c39Index + 1);
            const cAf39 = testStr.length > 0 ? testStr[0] : '';

            if (cAf39.length && this._zgHasUniPsLoCRegExp.test(cAf39)) {
                probability = this._pZg31Or3b50;
            } else {
                probability = lastEnc === 'zg' && hasGreatProb ? this._pZg31Or3b53 : this._pZg31Or3b50;
            }
        } else {
            probability = this._pZg31Or3b50;
        }

        return probability;
    }

    private getProbForZgC39(
        curStr: string,
        lastEnc: DetectedEnc,
        lastMatchedStr: string,
        hasGreatProb: boolean,
        curMatchedStr: string,
        aThatMatched: boolean): number {
        let probability: number;

        const c39Index = curMatchedStr.indexOf('\u1039');
        const testStr = c39Index === curMatchedStr.length - 1 ?
            curStr.substring(curMatchedStr.length) : curMatchedStr.substring(c39Index + 1);
        const cAf39 = testStr.length > 0 ? testStr[0] : '';

        if (curMatchedStr === '\u1004\u103A\u1039') {
            if (curMatchedStr.length === curStr.trim().length && (!lastMatchedStr.length || lastEnc == null)) {
                probability = this._pC20;
            } else {
                probability = this._pC50;
            }
        } else if ((curMatchedStr.length === curStr.trim().length) ||
            (cAf39.length && !this._zgHasUniPsLoCRegExp.test(cAf39)) ||
            this._zgOnlyCAndAcAfCRegExp.test(curMatchedStr)) {
            probability = aThatMatched || lastEnc === 'zg' || hasGreatProb ?
                this._pC95 : this._pC85;
        } else if (!aThatMatched && (!lastMatchedStr.length || lastEnc == null)) {
            probability = this._pC20;
        } else if (lastEnc === 'zg' && hasGreatProb) {
            probability = aThatMatched ? this._pC54 : this._pC52;
        } else {
            probability = this._pC50;
        }

        return probability;
    }

    private getProbForZgC3A(
        curStr: string,
        lastEnc: DetectedEnc,
        lastMatchedStr: string,
        hasGreatProb: boolean,
        curMatchedStr: string,
        aThatMatched: boolean): number {
        let probability: number;

        if (this._zgOnlyCAndAcAfCRegExp.test(curMatchedStr)) {
            probability = aThatMatched || lastEnc === 'zg' || hasGreatProb ?
                this._pC95 : this._pC85;
        } else if ((lastEnc == null || !lastMatchedStr.length) &&
            curMatchedStr.length === 2 && curMatchedStr.length === curStr.trim().length) {
            probability = this._pC55;
        } else if (this._zgNotWith3aRegExp.test(curMatchedStr)) {
            probability = this.containsZgOnlyAcCombine(curMatchedStr) ? this._pC50 : this._pC20;
        } else if (this.containsZgOnlyAcCombine(curMatchedStr)) {
            probability = hasGreatProb ? this._pC54 : this._pC52;
        } else if (lastEnc === 'zg' && hasGreatProb) {
            probability = this._pC52;
        } else {
            probability = this._pC50;
        }

        return probability;
    }

    private containsZgOnlyAcCombine(curMatchedStr: string): boolean {
        if (curMatchedStr.length > 2 && (this._zgOnlyAc2bOr2cCbRegExp.test(curMatchedStr) ||
            this._zgOnlyAc2dOr2eCbRegExp.test(curMatchedStr) || this._zgOnlyAc2fOr30CbRegExp.test(curMatchedStr) ||
            this._zgOnlyAc32Or36CbRegExp.test(curMatchedStr) || this._zgOnlyAc39CbRegExp.test(curMatchedStr) ||
            this._zgOnlyAc37CbRegExp.test(curMatchedStr) || this._zgOnlyAc3ACbRegExp.test(curMatchedStr))) {
            return true;
        }

        return false;
    }

    // Unicode
    //
    private detectUniMax(curStr: string, lastEnc: DetectedEnc, lastMatchedStr: string): DetectorMatch | null {
        let curMatchedStr = '';
        let accProb = 0;
        let hasGreatProb = false;

        while (curStr.length > 0) {
            let d = this.detectUniKinsi(curStr, lastEnc, lastMatchedStr + curMatchedStr, hasGreatProb);

            if (d == null) {
                d = this.detectUniPahsin(curStr, lastEnc, lastMatchedStr + curMatchedStr, hasGreatProb);
            }

            if (d == null) {
                d = this.detectUniC(curStr, lastEnc, lastMatchedStr + curMatchedStr, hasGreatProb);
            }

            if (d == null) {
                d = this.detectUniOnlyCodePoints(curStr);
            }

            if (d != null) {
                if (!hasGreatProb && d.probability >= 0.85) {
                    hasGreatProb = true;
                }
            } else {
                d = this.detectOtherChars(curStr, lastEnc, lastMatchedStr + curMatchedStr);
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

    private detectUniKinsi(curStr: string, lastEnc: DetectedEnc, lastMatchedStr: string, hasGreatProb: boolean): DetectorMatch | null {
        if (curStr.length < 3) {
            return null;
        }

        const c1 = curStr[0];
        const c2 = curStr[1];
        const c3 = curStr[2];

        if (c1 !== '\u1004' || c2 !== '\u103A' || c3 !== '\u1039') {
            return null;
        }

        if (curStr.length === 3) {
            return {
                detectedEnc: 'uni',
                probability: this._pUniKs60,
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
        let d = this.detectUniAThatWith31And2c(
            test3aStr,
            lastEnc,
            `${lastMatchedStr}\u1004\u103A\u1039`,
            hasGreatProb);
        if (d === null) {
            d = this.detectUniAThat(
                test3aStr,
                lastEnc,
                `${lastMatchedStr}\u1004\u103A\u1039`,
                hasGreatProb);
        }

        if (d != null && d.matchedString) {
            curMatchedStr = `\u1004\u103A\u1039${d.matchedString}`;
        }

        let probability: number;
        if ((!lastMatchedStr.length || lastEnc == null)) {
            probability = d != null ? this._pUniKs80 : this._pUniKs75;
        } else {
            probability = lastEnc === 'uni' || d != null || hasGreatProb ? this._pUniKs95 : this._pUniKs85;
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
        lastMatchedStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
        if (curStr.length < 3 || !lastMatchedStr.length) {
            return null;
        }

        if (curStr[1] !== '\u1039' || lastEnc !== 'uni') {
            return null;
        }

        if (!this._uniPsLeftEndRegExp.test(lastMatchedStr)) {
            return null;
        }

        let d = this.detectUniAThatWith31And2c(curStr, lastEnc, lastMatchedStr, hasGreatProb);
        if (d === null) {
            d = this.detectUniAThat(curStr, lastEnc, lastMatchedStr, hasGreatProb);
        }

        if (d != null) {
            return d;
        }

        const m = curStr.match(this._uniPsRegExp);

        if (m == null) {
            return null;
        }

        const curMatchedStr = m[0];
        let probability: number;

        if (curMatchedStr.includes('\u100D\u1039\u100D') ||
            curMatchedStr.includes('\u100D\u1039\u100E') ||
            curMatchedStr.includes('\u100F\u1039\u100D') ||
            curMatchedStr.includes('\u100B\u1039\u100C') ||
            curMatchedStr.includes('\u100B\u1039\u100B')) {
            probability = this._pZgPs95;
        } else {
            probability = hasGreatProb ? this._pUniPs95 : this._pUniPs50;
        }

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectUniC(
        curStr: string,
        lastEnc: DetectedEnc,
        lastMatchedStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
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

        let d = this.detectUniAThatWith31And2c(curStr, lastEnc, lastMatchedStr, hasGreatProb);
        if (d === null) {
            d = this.detectUniAThat(curStr, lastEnc, lastMatchedStr, hasGreatProb);
        }

        if (d != null) {
            return d;
        }

        const curMatchedStr = m[0];
        let probability: number;

        if (this.isUniOnlyCodePoint(curMatchedStr.codePointAt(0))) {
            probability = this._pUniCMax;
        } else {
            if (curStr.length > 1) {
                const testStr = curStr.substring(curMatchedStr.length);
                if (testStr.length > 0 && this._uniAllAcAnd60To97RegExp.test(testStr)) {
                    return null;
                }
            }

            if ((!lastMatchedStr.length || lastEnc == null) &&
                curMatchedStr.length === curStr.trim().length &&
                (curMatchedStr.includes('\u1031') || curMatchedStr.includes('\u103B'))) {
                probability = this._pUniCMax;
            } else if ((!lastMatchedStr.length || lastEnc == null) &&
                (curMatchedStr.includes('\u1031') || curMatchedStr.includes('\u103B'))) {
                probability = this._pC95;
            } else if (curMatchedStr.length === curStr.trim().length &&
                (curMatchedStr.includes('\u1031') || curMatchedStr.includes('\u103B'))) {
                probability = hasGreatProb ? this._pUniCMax : this._pC85;
            } else if (curMatchedStr.length === 2 && curMatchedStr.endsWith('\u103A')) {
                if (!lastMatchedStr.length || lastEnc !== 'uni' || !this._uniCAThatRegExp.test(curMatchedStr)) {
                    probability = this._pC20;
                } else {
                    probability = this._pC50;
                }
            } else {
                if (lastEnc === 'uni' && hasGreatProb) {
                    probability = this._pC54;
                } else {
                    probability = this._pC50;
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

    private detectUniAThatWith31And2c(
        curStr: string,
        lastEnc: DetectedEnc,
        lastMatchedStr: string,
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

        // (curStr[pos31 + 1] !== '\u102B' && curStr[pos31 + 1] !== '\u102C')
        if (pos31 === 0 || (curStr[pos31 + 2] !== '\u103A' && curStr[pos31 + 3] !== '\u103A')) {
            return null;
        }

        const m = curStr[1] === '\u1039' ? curStr.match(this._uniPs312cC3aRegExp) : curStr.match(this._uniC312cC3aRegExp);
        if (m == null) {
            return null;
        }

        const curMatchedStr = m[0];

        const probability = this.getProbabilityForAThat(curStr, lastEnc, lastMatchedStr, hasGreatProb, curMatchedStr);

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectUniAThat(
        curStr: string,
        lastEnc: DetectedEnc,
        lastMatchedStr: string,
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

        if (curStr.trim().length > curMatchedStr.length) {
            const testStr = curStr.substring(curMatchedStr.length);
            if (testStr.length > 0 && this._uniAllAcAnd60To97RegExp.test(testStr)) {
                return null;
            }
        }

        const probability = this.getProbabilityForAThat(curStr, lastEnc, lastMatchedStr, hasGreatProb, curMatchedStr);

        return {
            detectedEnc: 'uni',
            probability,
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

    // Shared
    //
    private detectOtherChars(curStr: string, lastEnc: DetectedEnc, lastMatchedStr: string): DetectorMatch | null {
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
            probability: lastMatchedStr.length > 0 && lastEnc != null ? 1 : hasPunctuation ? 0.5 : 0,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    // TODO: to review
    private getProbabilityForAThat(
        curStr: string,
        lastEnc: DetectedEnc,
        lastMatchedStr: string,
        hasGreatProb: boolean,
        curMatchedStr: string): number {
        let probability: number;
        const lastC = curMatchedStr[curMatchedStr.length - 1];

        if (lastC === '\u1037' || lastC === '\u1038') {
            if ((!lastMatchedStr.length || lastEnc == null) && curMatchedStr.length === curStr.trim().length) {
                probability = curMatchedStr.includes('\u1031') ? this._pAThat90 : this._pAThat85;
            } else if (!lastMatchedStr.length || lastEnc == null) {
                probability = curMatchedStr.includes('\u1031') ? this._pAThat90 : this._pAThat85;
            } else if (curMatchedStr.length === curStr.trim().length) {
                probability = lastEnc === 'uni' || hasGreatProb ? this._pAThat90 : this._pAThat85;
            } else {
                probability = lastEnc === 'uni' || hasGreatProb ? this._pAThat85 : this._pAThat65;
            }
        } else {
            if ((!lastMatchedStr.length || lastEnc == null) && curMatchedStr.length === curStr.trim().length) {
                probability = hasGreatProb ? this._pAThat55 : this._pAThat54;
            } else if (curMatchedStr.length === curStr.trim().length) {
                if (lastEnc === 'uni') {
                    probability = hasGreatProb ? this._pAThat53 : this._pAThat52;
                } else {
                    probability = this._pAThat50;
                }
            } else {
                if (lastEnc === 'uni') {
                    probability = hasGreatProb ? this._pAThat52 : this._pAThat51;
                } else {
                    probability = this._pAThat50;
                }
            }
        }

        return probability;
    }
}
