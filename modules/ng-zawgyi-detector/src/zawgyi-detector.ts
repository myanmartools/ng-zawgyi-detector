/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { DetectedEnc, DetectorMatch, DetectorResult } from './detector-result';

import { uniPahsinWords } from './uni-pahsin-words';

export interface ZawgyiDetectorOptions {
    preferZg?: boolean;
    detectMixType?: boolean;
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
const rZgC1For3a = '\u1000-\u1021\u1023\u1025\u1027\u1040\u1044\u106A\u106B\u1086\u108F\u1090';
const rZgOnlyCAndAcAfC = `${rZgAcKsAfC}\u1033\u1034\u105A\u106A\u106B\u107D\u1086-\u108A\u108F\u1090\u1094\u1095`;

const rZgPsDbG = `[${rZgUpC}][${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*[${rSp}]*[${rZgPsLoC}]`;
const rZgCAndOpG = `[${rZgUpC}][${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*`;
const rZgPsSgAndOpG = `[${rZgPsSgC}][${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*`;
const rZgPsDbAndOpG = `${rZgPsDbG}[${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*`;
const rZgCAndAThatG = `[${rCForAThat}](\u1039\u103A\u102C\u1038|\u1039\u1038|\u1039\u1037|\u1037\u1039|\u1039)`;

// Uni
const rUniC = '\u1000-\u102A\u103F\u1040-\u1049\u104E';
const rUniPsUpC = '\u1000-\u102A\u103F\u1040-\u1049';
const rUniPsLoC = '\u1000-\u101C\u101E-\u1022\u1027\u103F';
const rUniC1BfAThat = '\u1000-\u1023\u1025\u1027\u1029\u103F\u1040\u1044\u104E';

const rUniAcAf31G = '[\u102D\u102E]?[\u102F\u1030]?[\u102B\u102C]?\u103A?[\u1032\u1036]?[\u102B\u102C]?\u103A?\u1037?[\u102B\u102C]?\u103A?\u1038?';

// AThat suffix
const rUni312cAThatSuffixG = '[\u103B\u103C]?\u103E?\u1031[\u102B\u102C](\u1037\u103A|\u103A[\u1037\u1038]?)';
const rUniC31CAThatSuffixG = `[\u103B\u103C]?\u103E?\u1031[\u102B\u102C]?[${rCForAThat}](\u1037\u103A|\u103A[\u1037\u1038]?)`;
const rUniC1C2AThatSuffixG = `[\u103B\u103C]?(\u103D\u103E|[\u103D\u103E])?[\u102D\u102E]?[\u102F\u1030]?[\u102B\u102C]?[${rCForAThat}](\u1037\u103A|\u103A[\u1037\u1038]?)`;

const rUniKsAThatSuffixG = '(\u103A[\u103B\u103C]|[\u103B\u103C]\u103A)[\u102B\u102C][\u1037\u1038]?';

/**
 * Zawgyi-One and standard Myanmar Unicode detection service.
 */
@Injectable()
export class ZawgyiDetector {
    private readonly _options: ZawgyiDetectorOptions = {
        preferZg: false,
        detectMixType: true
    };

    // Seperator
    private readonly _seperatorRegExp = /^[#\*\(\[\{\'\"]?[\s]?(zawgyi|unicode|zg|uni|(\u101A\u1030\u1014\u102D?\u102E\u1000\u102F[\u1010\u1012][\u1039\u103A])|(\u1007\u1031\u102C\u103A\u1002\u103B\u102E)|(\u1031\u1007\u102C\u1039\u1002\u103A\u102D?\u102E))/i;

    private readonly _mixBlockTestRegExp = /[\u1000-\u1097]/g;

    // Zg
    private readonly _zgAllAcAfCRegExp = new RegExp(`^[${rZgAcAfC}${rZgAcKsAfC}]`);
    private readonly _zg31WCRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgCAndOpG}`);

    private readonly _zg31WPahsinSgRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgPsSgAndOpG}`);
    private readonly _zg31WPahsinDbRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgPsDbAndOpG}`);
    private readonly _zg3bWCRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*${rZgCAndOpG}`);
    private readonly _zg3bWPahsinSgRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*${rZgPsSgAndOpG}`);
    private readonly _zg3bWPahsinDbRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*${rZgPsDbAndOpG}`);
    private readonly _zgPahsinDbRegExp = new RegExp(`^${rZgPsDbAndOpG}`);
    private readonly _zgPahsinSgRegExp = new RegExp(`^${rZgPsSgAndOpG}`);
    private readonly _zgCAndOptionalRegExp = new RegExp(`^${rZgCAndOpG}`);

    private readonly _zg31WCAndAThatRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*[${rZgC1For3a}][${rSp}]*[${rZgAcKsAfC}]*[\u102B\u102C]${rZgCAndAThatG}`);
    private readonly _zg31WPahsinSgAndAThatRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*[${rZgPsSgC}][${rSp}]*[${rZgAcKsAfC}]*[\u102B\u102C]${rZgCAndAThatG}`);
    private readonly _zg31WPahsinDbAndAThatRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgPsDbG}[${rSp}]*[${rZgAcKsAfC}]*[\u102B\u102C]${rZgCAndAThatG}`);
    private readonly _zg3bWCAndAThatRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*[${rZgC1For3a}][${rSp}]*[${rZgAcKsAfC}]*[\u102B\u102C]${rZgCAndAThatG}`);
    private readonly _zg3bWPahsinSgAndAThatRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*[${rZgPsSgC}][${rSp}]*[${rZgAcKsAfC}]*[\u102B\u102C]${rZgCAndAThatG}`);
    private readonly _zg3bWPahsinDbAndAThatRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]${rZgPsDbG}[${rSp}]*[${rZgAcKsAfC}]*[\u102B\u102C]${rZgCAndAThatG}`);
    private readonly _zgCAndAThatRegExp = new RegExp(`^${rZgCAndAThatG}`);

    private readonly _zgOnlyCAndAcAfCRegExp = new RegExp(`[${rZgOnlyCAndAcAfC}]`);
    private readonly _zgOnlyCAndAcAfCFor31Or3bRegExp = new RegExp(`[${rZgOnlyCAndAcAfC}\u107E-\u1084]`);
    private readonly _zgOnlyAc2bOr2cCbRegExp = new RegExp('[\u102B\u102C]\u1039');
    private readonly _zgOnlyAc2dOr2eCbRegExp = new RegExp('[\u102D\u102E][\u1033\u1034\u103A\u103C\u103D]');
    private readonly _zgOnlyAc2fOr30CbRegExp = new RegExp('[\u102F\u1030\u1033\u1034][\u102D\u102E\u1039\u103C\u103D]');
    private readonly _zgOnlyAc32Or36CbRegExp = new RegExp('[\u1032\u1036][\u102D-\u1030\u1033\u1034\u103A\u103C\u103D]');
    private readonly _zgOnlyAc37CbRegExp = new RegExp('\u1037[\u102D\u102E\u1032\u1036\u1039\u103C\u103D]');
    private readonly _zgOnlyAc39CbRegExp = new RegExp('\u1039[\u102B\u102C\u102F\u1030\u1037\u1038\u103A\u103C\u103D]');
    private readonly _zgOnlyAc3ACbRegExp = new RegExp('\u103A[\u102B-\u102E\u1032-\u1034\u1036\u1039\u103C\u103D]');
    private readonly _zgCNotCompat3aRegExp = new RegExp('[\u1003\u1004\u1006-\u100F\u1011-\u1014\u1018\u101B\u101F-\u1021\u1023-\u1027\u1029\u102A]');
    private readonly _zgHasUniPsLoCRegExp = new RegExp(`^[${rUniPsLoC}]`);
    private readonly _zgCNotCompatWith3dRegExp = new RegExp('[\u1000\u1002\u1005-\u1008\u100B-\u100E\u1010-\u1013\u1018\u101E\u1020\u1021\u1023-\u1027\u1029\u102A]');

    // Uni
    //
    private readonly _uniAllAcAnd60To97RegExp = new RegExp('^[\u102B-\u103E\u105A\u1060-\u1097]');
    private readonly _uniKsAndPsRegExp = new RegExp(`^\u1004\u103A\u1039[${rUniPsUpC}]\u1039[${rUniPsLoC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31G}`);
    private readonly _uniKsAndCRegExp = new RegExp(`^\u1004\u103A\u1039[${rUniC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31G}`);
    private readonly _uniPsRegExp = new RegExp(`^[${rUniPsUpC}]\u1039[${rUniPsLoC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31G}`);
    private readonly _uniPsLeftEndRegExp = new RegExp(`[${rUniC}]\u103B?\u103C?[\u103D\u103E]?\u1031?\u102D?\u102F?[\u102B\u102C]?$`);
    private readonly _uniCAndOptionalRegExp = new RegExp(`^[${rUniC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31G}`);

    private readonly _uniOnlyAcAf31RegExp = new RegExp('[\u102B\u102C\u1037\u1038]');
    private readonly _uniOnlyAcAf3bRegExp = new RegExp('[\u102B-\u1038\u103A\u103D\u103E]');

    // Ks AThat (e.g. က်ျား)
    private readonly _uniCKsAThatRegExp = new RegExp(`^[${rUniC}]${rUniKsAThatSuffixG}`);

    // AThat with \u1031 + C2 (ကြောင် | လျှောင် | ငေါင် | ခေတ်)
    private readonly _uniC31CAThatRegExp = new RegExp(`^[${rUniC1BfAThat}]${rUniC31CAThatSuffixG}`);
    private readonly _uniPs31CAThatRegExp = new RegExp(`^[${rUniPsUpC}]\u1039[${rUniC1BfAThat}]${rUniC31CAThatSuffixG}`);

    // AThat with \u1031 (e.g. ကျော် | လျှော် | တော် | ခေါ်)
    private readonly _uniC312cAThatRegExp = new RegExp(`^[${rUniC1BfAThat}]${rUni312cAThatSuffixG}`);
    private readonly _uniPs312cAThatRegExp = new RegExp(`^[${rUniPsUpC}]\u1039[${rUniC1BfAThat}]${rUni312cAThatSuffixG}`);

    // C1 + C2 + AThat (e.g. ကျင် | ကွင် | ငင်)
    private readonly _uniC1C2AThatRegExp = new RegExp(`^[${rUniC1BfAThat}]${rUniC1C2AThatSuffixG}`);
    private readonly _uniPsC2AThatRegExp = new RegExp(`^[${rUniPsUpC}]\u1039[${rUniC1BfAThat}]${rUniC1C2AThatSuffixG}`);

    // Compat with AThat
    private readonly _uniC1CompatWithAThat = new RegExp(`[${rUniC1BfAThat}][\u103B\u103C]?[\u103D\u103E]?\u1031?[\u102D\u102E]?[\u102F\u1030]?[\u102B\u102C]?$`);
    private readonly _uniLastCCompatWithKsAThat = new RegExp(`[${rUniC1BfAThat}]\u103E?\u1031[\u102B\u102C]$`);
    private readonly _uniCAThatCompatRegExp = new RegExp(`^[${rCForAThat}]\u103A`);

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
    private readonly _pUniPs60 = 0.6;
    private readonly _pUniPs50 = 0.5;

    private readonly _pAThat95 = 0.95;
    private readonly _pAThat75 = 0.75;
    private readonly _pAThat54 = 0.54;
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
     * @param options Options for current detection.
     * @returns Returns the result object.
     */
    detect(input: string, options?: ZawgyiDetectorOptions): DetectorResult {
        const startTime = +new Date();
        const curOptions = { ...this._options, ...options };

        const result: DetectorResult = {
            detectedEnc: null,
            duration: 0,
            matches: []
        };

        if (!input.length || !input.trim().length) {
            result.duration = Math.max(+new Date() - startTime, 0);
            result.matches.push({
                detectedEnc: null,
                probability: 0,
                start: 0,
                length: input.length,
                matchedString: input
            });

            return result;
        }

        let curStr = input;
        let curStart = 0;
        let lastStr = '';
        let lastEnc: DetectedEnc = null;

        while (curStr.length > 0) {
            const r = this.detectInternal(curStr, lastEnc, lastStr, curOptions);
            const sd = r.sd;
            const cd = r.cd;

            if ((sd == null || sd.detectedEnc === null) && lastEnc != null) {
                const lastMatch = result.matches[result.matches.length - 1];
                lastMatch.length += curStr.length;
                lastMatch.matchedString += curStr;

                break;
            }

            if (sd == null || sd.detectedEnc === null || curOptions.detectMixType === false) {
                result.matches.push({
                    detectedEnc: sd ? sd.detectedEnc : null,
                    probability: sd ? sd.probability : 0,
                    start: curStart,
                    length: curStr.length,
                    matchedString: curStr,
                    competitorMatch: cd != null ? cd : undefined
                });

                break;
            }

            if (lastEnc === sd.detectedEnc && result.matches.length > 0) {
                const lastMatch = result.matches[result.matches.length - 1];
                if (lastMatch.probability > 0 && sd.probability > 0) {
                    lastMatch.probability = (lastMatch.probability + sd.probability) / 2;
                }
                lastMatch.length += sd.length;
                lastMatch.matchedString = `${lastMatch.matchedString}${sd.matchedString}`;
                if (lastMatch.competitorMatch != null && cd != null) {
                    const lastCompetitorMatch = lastMatch.competitorMatch;
                    if (lastCompetitorMatch.probability > 0 && cd.probability > 0) {
                        lastCompetitorMatch.probability = (lastCompetitorMatch.probability + cd.probability) / 2;
                    }
                    lastCompetitorMatch.length += cd.length;
                    lastCompetitorMatch.matchedString = `${lastCompetitorMatch.matchedString}${cd.matchedString}`;
                }
            } else {
                result.matches.push({
                    ...sd,
                    start: curStart,
                    competitorMatch: cd != null ? cd : undefined
                });
            }

            lastEnc = sd.detectedEnc;
            lastStr += sd.matchedString;
            curStart += sd.length;
            curStr = curStr.substring(sd.length);
        }

        if (result.matches.length > 1) {
            result.detectedEnc = 'mix';
        } else if (result.matches.length === 1 && result.matches[0].detectedEnc === 'zg') {
            result.detectedEnc = 'zg';
        } else if (result.matches.length === 1 && result.matches[0].detectedEnc === 'uni') {
            result.detectedEnc = 'uni';
        } else {
            result.detectedEnc = null;
        }

        result.duration = Math.max(+new Date() - startTime, 0);

        return result;
    }

    private detectInternal(
        curStr: string,
        lastEnc: DetectedEnc,
        lastStr: string,
        curOptions: ZawgyiDetectorOptions): { sd: DetectorMatch | null; cd?: DetectorMatch | null } {
        let zd: DetectorMatch | null = null;
        let ud: DetectorMatch | null = null;
        let zdChecked = false;

        const c = curStr.trim()[0];

        if (c === '\u1031' || c === '\u103B' || c === '\u107E' || c === '\u107F' || c === '\u1080' ||
            c === '\u1081' || c === '\u1082' || c === '\u1083' || c === '\u1084') {
            zd = this.detectZg(curStr, lastEnc, lastStr);
            zdChecked = true;
        }

        if (zd == null || zd.probability < 0.95 || zd.matchedString.length !== curStr.length) {
            ud = this.detectUni(curStr, lastEnc, lastStr);
        }

        if (!zdChecked && (ud == null || ud.probability < 0.95 || ud.matchedString.length !== curStr.length)) {
            zd = this.detectZg(curStr, lastEnc, lastStr);
        }

        let sd: DetectorMatch | null = null;
        let cd: DetectorMatch | null = null;

        if (ud != null && zd != null) {
            if (zd.detectedEnc != null && ud.detectedEnc != null) {
                if (zd.length === ud.length) {
                    const diff = ud.probability - zd.probability;
                    if (diff === 0) {
                        if (lastEnc === 'uni') {
                            sd = ud;
                        } else if (lastEnc === 'zg') {
                            sd = zd;
                        } else {
                            sd = curOptions.preferZg ? zd : ud;
                        }
                    } else if (diff < 0) {
                        if (lastEnc === 'uni' && ud.probability > 0.5 && -diff < 0.02) {
                            sd = ud;
                        } else {
                            sd = zd;
                        }
                    } else {
                        if (lastEnc === 'zg' && zd.probability > 0.5 && (diff < 0.02 || (curOptions.preferZg && diff < 0.021))) {
                            sd = zd;
                        } else {
                            sd = ud;
                        }
                    }
                } else if (zd.length > ud.length) {
                    sd = zd;
                } else {
                    sd = ud;
                }
            } else if (zd.detectedEnc == null && ud.detectedEnc == null) {
                sd = zd.length > ud.length ? zd : ud;
            } else {
                sd = zd.detectedEnc != null ? zd : ud;
            }

            cd = sd.detectedEnc === 'uni' ? zd : ud;
        } else if (ud != null) {
            sd = ud;
        } else if (zd != null) {
            sd = zd;
        }

        return {
            sd,
            cd
        };
    }

    // Zawgyi
    //
    private detectZg(curStr: string, lastEnc: DetectedEnc, lastStr: string): DetectorMatch | null {
        let curMatchedStr = '';
        let accProb = 0;
        let hasGreatProb = false;
        let seperatorStart = -1;
        let startOfNewChunk = true;
        let zgDetected = false;
        let hasUnDeteactableStart = false;

        while (curStr.length > 0) {
            let d = this.detectZg31Start(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);

            if (d == null) {
                d = this.detectZg3bStart(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);
            }

            if (d == null) {
                d = this.detectZgPahsin(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);
            }

            if (d == null) {
                d = this.detectZgC(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);
            }

            if (d != null) {
                startOfNewChunk = false;
                zgDetected = true;

                if (!hasGreatProb && d.probability >= 0.85) {
                    hasGreatProb = true;
                }
            } else {
                d = this.detectOtherChars(curStr, lastEnc, lastStr + curMatchedStr, startOfNewChunk);
                if (d != null && d.start > -1) {
                    seperatorStart = d.start;
                }
                if (d != null && d.probability > 0 && d.probability < 0.1) {
                    hasUnDeteactableStart = true;
                }
            }

            if (d == null) {
                break;
            }

            curMatchedStr += d.matchedString;
            lastEnc = d.detectedEnc;
            curStr = curStr.substring(d.matchedString.length);

            if (d.probability > 0) {
                accProb = accProb === 0 ? d.probability : (accProb + d.probability) / 2;
            }

            if (seperatorStart > -1) {
                break;
            }
        }

        if (!curMatchedStr.length) {
            return null;
        }

        return {
            detectedEnc: zgDetected || accProb >= 0.5 || hasUnDeteactableStart ? 'zg' : null,
            probability: accProb,
            start: seperatorStart,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectZg31Start(
        curStr: string,
        lastEnc: DetectedEnc,
        lastStr: string,
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

        const probability = this.getProbForZg31(curStr, lastEnc, lastStr, hasGreatProb, curMatchedStr, aThatMatched, pahsinMatched);

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
        lastStr: string,
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

        const probability = this.getProbForZg3b(curStr, lastEnc, lastStr, hasGreatProb, curMatchedStr, aThatMatched, pahsinMatched);

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
        lastStr: string,
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
            const d = this.detectZg39AThatSufix(testStr);
            if (d != null) {
                curMatchedStr += d.matchedString;
                aThatMatched = true;
            }
        }

        let probability: number;
        if (lastEnc === 'zg' || hasGreatProb || !lastStr.length ||
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
        lastStr: string,
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
            const d = this.detectZg39AThatSufix(testStr);
            if (d != null) {
                curMatchedStr += d.matchedString;
                aThatMatched = true;
            }
        }

        let probability: number;
        const c = curMatchedStr[0];

        if (c === '\u104E' || c === '\u106A' || c === '\u106B' || c === '\u1086' || c === '\u108F' || c === '\u1090') {
            if (lastEnc === 'zg' || lastEnc == null || hasGreatProb ||
                !lastStr.length || curMatchedStr.length === curStr.trim().length) {
                probability = this._pC95;
            } else {
                probability = this._pC85;
            }
        } else if (curMatchedStr.includes('\u1039')) {
            probability = this.getProbForZgC39AThat(curStr, lastEnc, lastStr, hasGreatProb, curMatchedStr, aThatMatched);
        } else if (curMatchedStr.includes('\u103A')) {
            probability = this.getProbForZgC3A(curStr, lastEnc, lastStr, hasGreatProb, curMatchedStr, aThatMatched);
        } else if (curMatchedStr.includes('\u103D')) {
            if (!curMatchedStr.includes('\u103C') && this._zgCNotCompatWith3dRegExp.test(c)) {
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

    private detectZg39AThatSufix(curStr: string): DetectorMatch | null {
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
        lastStr: string,
        hasGreatProb: boolean,
        curMatchedStr: string,
        aThatMatched: boolean,
        pahsinMatched: boolean): number {
        let probability: number;

        if ((!lastStr.length || lastEnc == null) && curMatchedStr.length === curStr.trim().length) {
            probability = this._pZg31Or3b95;
        } else if (!lastStr.length || lastEnc == null) {
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
        lastStr: string,
        hasGreatProb: boolean,
        curMatchedStr: string,
        aThatMatched: boolean,
        pahsinMatched: boolean): number {
        let probability: number;

        if ((!lastStr.length || lastEnc == null) && curMatchedStr.length === curStr.trim().length) {
            probability = this._pZg31Or3b95;
        } else if (!lastStr.length || lastEnc == null) {
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

    private getProbForZgC39AThat(
        curStr: string,
        lastEnc: DetectedEnc,
        lastStr: string,
        hasGreatProb: boolean,
        curMatchedStr: string,
        aThatMatched: boolean): number {
        let probability: number;

        const c39Index = curMatchedStr.indexOf('\u1039');
        const testStr = c39Index === curMatchedStr.length - 1 ?
            curStr.substring(curMatchedStr.length) : curMatchedStr.substring(c39Index + 1);
        const cAf39 = testStr.length > 0 ? testStr[0] : '';

        if (curMatchedStr === '\u1004\u103A\u1039') {
            if (curMatchedStr.length === curStr.trim().length && (!lastStr.length || lastEnc == null)) {
                probability = this._pC20;
            } else {
                probability = this._pC50;
            }
        } else if ((curMatchedStr.length === curStr.trim().length) ||
            (cAf39.length && !this._zgHasUniPsLoCRegExp.test(cAf39)) ||
            this._zgOnlyCAndAcAfCRegExp.test(curMatchedStr)) {
            probability = aThatMatched || lastEnc === 'zg' || hasGreatProb ?
                this._pC95 : this._pC85;
        } else if (!aThatMatched && (!lastStr.length || lastEnc == null)) {
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
        lastStr: string,
        hasGreatProb: boolean,
        curMatchedStr: string,
        aThatMatched: boolean): number {
        let probability: number;
        const cBf3a = curMatchedStr[curMatchedStr.indexOf('\u103A') - 1];

        if (this._zgOnlyCAndAcAfCRegExp.test(curMatchedStr)) {
            probability = aThatMatched || lastEnc === 'zg' || hasGreatProb ?
                this._pC95 : this._pC85;
        } else if ((lastEnc == null || !lastStr.length) &&
            curMatchedStr.length === 2 && curMatchedStr.length === curStr.trim().length) {
            probability = this._pC55;
        } else if (this._zgCNotCompat3aRegExp.test(cBf3a)) {
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
    private detectUni(curStr: string, lastEnc: DetectedEnc, lastStr: string): DetectorMatch | null {
        let curMatchedStr = '';
        let accProb = 0;
        let hasGreatProb = false;
        let seperatorStart = -1;
        let startOfNewChunk = true;
        let uniDetected = false;

        while (curStr.length > 0) {
            let d = this.detectUniKs(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);

            if (d == null) {
                d = this.detectUniPahsin(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);
            }

            if (d == null) {
                d = this.detectUniC(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);
            }

            if (d == null) {
                d = this.detectUniOnlyCodePoints(curStr);
            }

            if (d != null) {
                startOfNewChunk = false;
                uniDetected = true;

                if (!hasGreatProb && d.probability >= 0.85) {
                    hasGreatProb = true;
                }
            } else {
                d = this.detectOtherChars(curStr, lastEnc, lastStr + curMatchedStr, startOfNewChunk);
                if (d != null && d.start > -1) {
                    seperatorStart = d.start;
                }
            }

            if (d == null) {
                break;
            }

            curMatchedStr += d.matchedString;
            lastEnc = d.detectedEnc;
            curStr = curStr.substring(d.matchedString.length);

            if (d.probability > 0) {
                accProb = accProb === 0 ? d.probability : (accProb + d.probability) / 2;
            }

            if (seperatorStart > -1) {
                break;
            }
        }

        if (!curMatchedStr.length) {
            return null;
        }

        return {
            detectedEnc: uniDetected || accProb >= 0.5 ? 'uni' : null,
            probability: accProb,
            start: seperatorStart,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectUniKs(curStr: string, lastEnc: DetectedEnc, lastStr: string, hasGreatProb: boolean): DetectorMatch | null {
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
        let d = this.detectUniAThatWith31(
            test3aStr,
            lastEnc,
            `${lastStr}\u1004\u103A\u1039`,
            hasGreatProb);
        if (d === null) {
            d = this.detectUniAThat(
                test3aStr,
                lastEnc,
                `${lastStr}\u1004\u103A\u1039`,
                hasGreatProb);
        }

        if (d != null) {
            curMatchedStr = `\u1004\u103A\u1039${d.matchedString}`;
        }

        let probability: number;
        if ((!lastStr.length || lastEnc == null)) {
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
        lastStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
        if (curStr.length < 3 || curStr[1] !== '\u1039') {
            return null;
        }

        let startsWithSgPs = false;

        if (curStr.startsWith('\u100D\u1039\u100D') ||
            curStr.startsWith('\u100D\u1039\u100E') ||
            curStr.startsWith('\u100F\u1039\u100D') ||
            curStr.startsWith('\u100B\u1039\u100C') ||
            curStr.startsWith('\u100B\u1039\u100B')) {
            startsWithSgPs = true;
        }

        if (!startsWithSgPs && (!lastStr.length || lastEnc !== 'uni' || !this._uniPsLeftEndRegExp.test(lastStr))) {
            return null;
        }

        let d = this.detectUniAThatWith31(curStr, lastEnc, lastStr, hasGreatProb);
        if (d === null) {
            d = this.detectUniAThat(curStr, lastEnc, lastStr, hasGreatProb);
        }

        let curMatchedStr: string;

        if (d != null) {
            curMatchedStr = d.matchedString;
        } else {
            const m = curStr.match(this._uniPsRegExp);

            if (m == null) {
                return null;
            }
            curMatchedStr = m[0];
        }

        let probability: number;

        if (startsWithSgPs ||
            curMatchedStr.includes('\u100D\u1039\u100D') ||
            curMatchedStr.includes('\u100D\u1039\u100E') ||
            curMatchedStr.includes('\u100F\u1039\u100D') ||
            curMatchedStr.includes('\u100B\u1039\u100C') ||
            curMatchedStr.includes('\u100B\u1039\u100B')) {
            probability = this._pUniPs95;
        } else if (this.isInUniPahsin(curStr, lastStr)) {
            probability = this._pUniPs60;
        } else if (d != null) {
            if (curMatchedStr.includes('\u1031') && (curMatchedStr.includes('\u102B') || curMatchedStr.includes('\u102C'))) {
                probability = this._pAThat95;
            } else {
                probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs50;
            }
        } else {
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs50;
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
        lastStr: string,
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

        const c = curStr[0];
        if (c === '\u104C' || c === '\u104D' || c === '\u104F') {
            return {
                detectedEnc: 'uni',
                probability: lastEnc === 'uni' && hasGreatProb ? this._pC54 : this._pC50,
                start: -1,
                length: 1,
                matchedString: c
            };
        }

        const m = curStr.match(this._uniCAndOptionalRegExp);
        if (m == null) {
            return null;
        }

        let d = this.detectUniAThatWith31(curStr, lastEnc, lastStr, hasGreatProb);
        if (d === null) {
            d = this.detectUniAThat(curStr, lastEnc, lastStr, hasGreatProb);
        }
        if (d === null) {
            d = this.detectUniKsAThat(curStr, lastEnc, lastStr, hasGreatProb);
        }

        if (d != null) {
            return d;
        }

        const curMatchedStr = m[0];
        let probability: number;

        if (this.isUniOnlyCodePoint(curMatchedStr.codePointAt(0))) {
            probability = this._pUniCMax;
        } else if (curMatchedStr.includes('\u1031') &&
            curMatchedStr.indexOf('\u1031') + 1 < curMatchedStr.length &&
            this._uniOnlyAcAf31RegExp.test(curMatchedStr.substring(curMatchedStr.indexOf('\u1031') + 1))) {
            probability = this._pUniCMax;
        } else if (curMatchedStr.includes('\u103B') &&
            curMatchedStr.indexOf('\u103B') + 1 < curMatchedStr.length &&
            this._uniOnlyAcAf3bRegExp.test(curMatchedStr.substring(curMatchedStr.indexOf('\u103B') + 1))) {
            probability = this._pUniCMax;
        } else if (curMatchedStr.includes('\u103A')) {
            probability = !lastStr.length || lastEnc == null || !this._uniC1CompatWithAThat.test(lastStr) ?
                this._pC20 : this._pC50;
        } else {
            if (curStr.length > 1) {
                const testStr = curStr.substring(curMatchedStr.length);
                if (testStr.length > 0 && this._uniAllAcAnd60To97RegExp.test(testStr)) {
                    return null;
                }
            }

            if ((!lastStr.length || lastEnc == null) &&
                curMatchedStr.length === curStr.trim().length &&
                (curMatchedStr.includes('\u1031') || curMatchedStr.includes('\u103B'))) {
                probability = this._pC95;
            } else if (curMatchedStr.length === curStr.trim().length &&
                (curMatchedStr.includes('\u1031') || curMatchedStr.includes('\u103B'))) {
                probability = hasGreatProb ? this._pC95 : this._pC85;
            } else if (curMatchedStr.length === 2 && curMatchedStr.endsWith('\u103A')) {
                if (!lastStr.length || lastEnc !== 'uni' || !this._uniCAThatCompatRegExp.test(curMatchedStr)) {
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

    private detectUniKsAThat(
        curStr: string,
        lastEnc: DetectedEnc,
        lastStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
        if (curStr.length < 3 || !lastStr.length || lastEnc == null) {
            return null;
        }

        let pos3a = -1;
        for (let i = 1; i < 3; i++) {
            if (curStr[i] === '\u103A') {
                pos3a = i;
                break;
            }
        }

        if (pos3a < 1) {
            return null;
        }

        const m = curStr.match(this._uniCKsAThatRegExp);

        if (m == null) {
            return null;
        }

        if (!this._uniLastCCompatWithKsAThat.test(lastStr)) {
            return null;
        }

        const curMatchedStr = m[0];

        if (curStr.trim().length > curMatchedStr.length) {
            const testStr = curStr.substring(curMatchedStr.length);
            if (testStr.length > 0 && this._uniAllAcAnd60To97RegExp.test(testStr)) {
                return null;
            }
        }

        let probability: number;

        const cBf3a = curMatchedStr[curMatchedStr.indexOf('\u103A') - 1];

        if (curMatchedStr[0] === '\u103F' ||
            curMatchedStr.includes('\u103B\u102C') ||
            curMatchedStr.includes('\u103B\u103A') ||
            this.isUniOnlyCodePoint(curMatchedStr.codePointAt(0))) {
            probability = this._pAThat95;
        } else if (this._zgCNotCompat3aRegExp.test(cBf3a)) {
            probability = hasGreatProb || curMatchedStr.endsWith('\u1037') || curMatchedStr.endsWith('\u1038') ?
                this._pAThat75 : this._pAThat54;
        } else {
            probability = lastEnc === 'uni' && lastStr.length && hasGreatProb ? this._pAThat54 : this._pAThat50;
        }

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }

    private detectUniAThatWith31(
        curStr: string,
        lastEnc: DetectedEnc,
        lastStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
        if (curStr.length < 4 || (curStr[1] === '\u1039' && curStr.length < 6)) {
            return null;
        }

        const i3aStart = curStr[1] === '\u1039' ? 3 : 1;
        const max3aLen = curStr[1] === '\u1039' ? 10 : 8;
        const actMax3aLen = curStr.length < max3aLen ? curStr.length : max3aLen;

        let pos3a = -1;
        let pos31 = -1;

        for (let i = i3aStart; i < actMax3aLen; i++) {
            if (curStr[i] === '\u1031') {
                pos31 = i;
            }
            if (curStr[i] === '\u103A') {
                pos3a = i;
                break;
            }
        }

        if (pos3a < 2 || pos31 < 1) {
            return null;
        }

        let m: RegExpMatchArray | null = null;
        if (curStr[1] === '\u1039') {
            m = curStr.match(this._uniPs31CAThatRegExp);
            if (m == null) {
                m = curStr.match(this._uniPs312cAThatRegExp);
            }
        } else {
            m = curStr.match(this._uniC31CAThatRegExp);
            if (m == null) {
                m = curStr.match(this._uniC312cAThatRegExp);
            }
        }

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

        let probability: number;

        const cBf3a = curMatchedStr[curMatchedStr.indexOf('\u103A') - 1];

        if (curMatchedStr.includes('\u103F') ||
            curMatchedStr.includes('\u102B') ||
            curMatchedStr.includes('\u102C') ||
            curMatchedStr.includes('\u103E') ||
            this.isUniOnlyCodePoint(curMatchedStr.codePointAt(0))) {
            probability = this._pAThat95;
        } else if (this._zgCNotCompat3aRegExp.test(cBf3a)) {
            probability = hasGreatProb || curMatchedStr.endsWith('\u1037') || curMatchedStr.endsWith('\u1038') ?
                this._pAThat75 : this._pAThat54;
        } else {
            probability = lastEnc === 'uni' && lastStr.length && hasGreatProb ? this._pAThat54 : this._pAThat50;
        }

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
        lastStr: string,
        hasGreatProb: boolean): DetectorMatch | null {
        if (curStr.length < 3 || (curStr[1] === '\u1039' && curStr.length < 5)) {
            return null;
        }

        const i3aStart = curStr[1] === '\u1039' ? 4 : 2;
        const max3aLen = curStr[1] === '\u1039' ? 11 : 9;
        const actMax3aLen = curStr.length < max3aLen ? curStr.length : max3aLen;

        let pos3a = -1;

        for (let i = i3aStart; i < actMax3aLen; i++) {
            if (curStr[i] === '\u103A') {
                pos3a = i;
                break;
            }
        }

        if (pos3a < 2) {
            return null;
        }

        const m = curStr[1] === '\u1039' ? curStr.match(this._uniPsC2AThatRegExp) : curStr.match(this._uniC1C2AThatRegExp);

        if (m == null) {
            return null;
        }

        let curMatchedStr = m[0];

        if (curStr.trim().length > curMatchedStr.length) {
            const testStr = curStr.substring(curMatchedStr.length);
            if (testStr.length > 0 && this._uniAllAcAnd60To97RegExp.test(testStr)) {
                let hasM2 = false;
                if (curMatchedStr.endsWith('\u103A')) {
                    const p1 = curMatchedStr[curMatchedStr.length - 2];
                    const p2 = curStr.substring(curMatchedStr.length);
                    const testStr2 = p1 + p2;
                    const m2 = testStr2.match(this._uniC1C2AThatRegExp);
                    if (m2 != null) {
                        curMatchedStr += m2[0].substring(2);
                        hasM2 = true;
                    }
                }

                if (!hasM2) {
                    return null;
                }
            }
        }

        let probability: number;

        const cBf3a = curMatchedStr[curMatchedStr.indexOf('\u103A') - 1];

        if (curMatchedStr[0] === '\u104E' ||
            curMatchedStr[0] === '\u103F' ||
            curMatchedStr.includes('\u103E') ||
            this.isUniOnlyCodePoint(curMatchedStr.codePointAt(0)) ||
            (curMatchedStr.includes('\u103B') &&
                this._uniOnlyAcAf3bRegExp.test(curMatchedStr.substring(curMatchedStr.indexOf('\u103B') + 1))) ||
            this.isUniOnlyCodePoint(curMatchedStr.codePointAt(0))) {
            probability = this._pAThat95;
        } else if (this._zgCNotCompat3aRegExp.test(cBf3a)) {
            probability = hasGreatProb || curMatchedStr.endsWith('\u1037') || curMatchedStr.endsWith('\u1038') ?
                this._pAThat75 : this._pAThat54;
        } else {
            probability = lastEnc === 'uni' && lastStr.length && hasGreatProb ? this._pAThat54 : this._pAThat50;
        }

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

    private isInUniPahsin(curStr: string, lastStr: string): boolean {
        let found = false;

        // Exact
        if (lastStr + curStr === '\u1015\u1010\u1039\u1010\u102c') {
            return true;
        }
        if (lastStr + curStr === '\u1015\u1010\u1039\u1010\u102c\u1001\u1036') {
            return true;
        }
        if (lastStr + curStr === '\u1019\u102d\u1010\u1039\u1010\u1030') {
            return true;
        }

        for (const pair of uniPahsinWords) {
            const leftStr = pair[0];
            const rightStr = pair[1];

            if (curStr.length < rightStr.length) {
                continue;
            }

            if (leftStr.length && lastStr.length < leftStr.length) {
                continue;
            }

            if (!curStr.startsWith(rightStr)) {
                continue;
            }

            if (leftStr.length && !lastStr.endsWith(leftStr)) {
                continue;
            }

            found = true;
        }

        return found;
    }

    // Shared
    //
    private detectOtherChars(curStr: string, lastEnc: DetectedEnc, lastStr: string, startOfNewChunk: boolean): DetectorMatch | null {
        let curMatchedStr = '';
        let hasPunctuation = false;
        let hasUnDeteactableStart = false;
        let seperatorStart = -1;
        let prevIsNewLine = false;

        for (let i = 0; i < curStr.length; i++) {
            const c = curStr[i];

            if (c === ' ' || c === '\t') {
                curMatchedStr += c;
                continue;
            }

            if (c === '\n' || c === '\r') {
                prevIsNewLine = true;
                curMatchedStr += c;
                continue;
            }

            if (prevIsNewLine && !startOfNewChunk && lastEnc != null && lastStr.length > 0 &&
                (c === '[' || c === '(' || c === '{' || c === '#' || c === '*' || c === '\'' || c === '"' ||
                    c === 'z' || c === 'u' || c === '\u101A' || c === '\u1007' || c === '\u1031' || c === '\u104A' || c === '\u104B')) {
                const testStr = curStr.substring(i);

                const m = testStr.match(this._seperatorRegExp);
                if (m != null && curStr.length > m[0].length && this._mixBlockTestRegExp.test(curStr.substring(m[0].length))) {
                    seperatorStart = i;
                    break;
                }
            }

            const cp = c.codePointAt(0);

            if (cp == null) {
                curMatchedStr += c;
                continue;
            }

            prevIsNewLine = false;

            if (cp === 0x104A || cp === 0x104B) {
                hasPunctuation = true;
                curMatchedStr += c;
                continue;
            }

            if ((lastEnc === null && !lastStr.length) && ((cp >= 0x102B && cp <= 0x1030) ||
                (cp >= 0x1032 && cp <= 0x1034) ||
                (cp >= 0x1036 && cp <= 0x103A) ||
                (cp >= 0x103C && cp <= 0x103E) ||
                cp === 0x105A ||
                (cp >= 0x1060 && cp <= 0x1069) ||
                (cp >= 0x106C && cp <= 0x106D) ||
                (cp >= 0x1070 && cp <= 0x107D) ||
                cp === 0x1085 ||
                (cp >= 0x1086 && cp <= 0x108E) ||
                (cp >= 0x1093 && cp <= 0x1096))) {
                hasUnDeteactableStart = true;
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

        let probability: number;
        if (lastStr.length > 0 && lastEnc != null) {
            probability = 1;
        } else if (hasUnDeteactableStart) {
            probability = 0.05;
        } else if (hasPunctuation) {
            probability = curMatchedStr.length === curStr.length ? 0.5 : 0.25;
        } else {
            probability = 0;
        }

        return {
            detectedEnc: null,
            probability,
            start: seperatorStart,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    }
}
