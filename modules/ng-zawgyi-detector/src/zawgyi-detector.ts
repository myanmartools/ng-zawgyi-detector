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
}

export const ZAWGYI_DETECTOR_OPTIONS = new InjectionToken<ZawgyiDetectorOptions>('ZawgyiDetectorOptions');

const rSp = ' \u00A0\u1680\u2000-\u200D\u202F\u205F\u2060\u3000\uFEFF';

// Zg
const rZg3b = '\u103B\u107E-\u1084';
const rZgUpC = '\u1000-\u1021\u1023-\u1027\u1029\u102A\u1040-\u1049\u104C-\u104F\u106A\u106B\u1086\u108F\u1090';
const rZgPsLoC = '\u1060-\u1063\u1065-\u1069\u106C\u106D\u1070-\u107C\u1085\u1093\u1096';
const rZgPsSgC = '\u106E\u106F\u1091\u1092\u1097';
const rZgAcAfC = '\u102B-\u1030\u1032-\u1034\u1036-\u103A\u103C\u103D\u105A\u107D\u1087-\u108A\u108E\u1094\u1095';
const rZgAcKsAfC = '\u1064\u108B-\u108D';

const rZgPsDbG = `[${rZgUpC}][${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*[${rSp}]*[${rZgPsLoC}]`;
const rZgPsDbAndOpG = `${rZgPsDbG}[${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*`;
const rZgPsSgAndOpG = `[${rZgPsSgC}][${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*`;
const rZgCAndOpG = `[${rZgUpC}][${rSp}]*[${rZgAcAfC}${rZgAcKsAfC}]*`;

// Uni
const rUniC = '\u1000-\u102A\u103F\u1040-\u1049\u104C-\u104F';
const rUniPsUpC = '\u1000-\u102A\u103F\u1040-\u1049';
const rUniPsLoC = '\u1000-\u101C\u101E-\u1022\u1027\u103F';
const rUniAcAf31 = '[\u102D\u102E]?[\u102F\u1030]?[\u102B\u102C]?\u103A?[\u1032\u1036]?[\u102B\u102C]?\u103A?\u1037?[\u102B\u102C]?\u103A?\u1038?';

/**
 * Zawgyi-One and standard Myanmar Unicode detection service.
 */
@Injectable()
export class ZawgyiDetector {
    private readonly _options: ZawgyiDetectorOptions = {
        includeMatchedStringInResult: true
    };

    private readonly _zg31Or3bStartWOptionalSpRegExp = new RegExp(`^[${rSp}]*[\u1031${rZg3b}]+`);
    private readonly _zg31AndOptional3bStartRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*`);
    private readonly _zg3bStartRegExp = new RegExp(`^[${rZg3b}]+`);
    private readonly _zg31AndOptional3bWPahsinRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgPsDbAndOpG}`);
    private readonly _zg31AndOptional3bWPahsinSingleRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgPsSgAndOpG}`);
    private readonly _zg31AndOptional3bWCRegExp = new RegExp(`^\u1031+[${rSp}]*[${rZg3b}]*[${rSp}]*${rZgCAndOpG}`);
    private readonly _zg3bWPahsinRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*${rZgPsDbAndOpG}`);
    private readonly _zg3bWPahsinSingleRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*${rZgPsSgAndOpG}`);
    private readonly _zg3bWCRegExp = new RegExp(`^[${rZg3b}]+[${rSp}]*${rZgCAndOpG}`);
    private readonly _zgPahsinRegExp = new RegExp(`^${rZgPsDbAndOpG}`);
    private readonly _zgPahsinSingleRegExp = new RegExp(`^${rZgPsSgAndOpG}`);
    private readonly _zgCAndOptionalRegExp = new RegExp(`^${rZgCAndOpG}`);
    private readonly _zgOnlyAcRegExp = new RegExp(`[${rZgAcKsAfC}\u107D-\u1084\u1087-\u108E\u1094\u1095]`);
    private readonly _zgOnlyAc2bOr2cCbRegExp = new RegExp('[\u102B\u102C][\u1039]');
    private readonly _zgOnlyAc2dOr2eCbRegExp = new RegExp('[\u102D\u102E][\u1033\u1034\u103A\u103C\u103D]');
    private readonly _zgOnlyAc2fOr30CbRegExp = new RegExp('[\u102F\u1030\u1033\u1034][\u102D\u102E\u103C\u103D\u1039]');
    private readonly _zgOnlyAc32Or36CbRegExp = new RegExp('[\u1032\u1036][\u102D-\u1030\u1033\u1034\u103A\u103C\u103D]');
    private readonly _zgOnlyAc39CbRegExp = new RegExp('\u1039[\u102B\u102C\u1037]');
    private readonly _zgOnlyAc3ACbRegExp = new RegExp('\u103A[\u102D\u102E\u1032\u1036\u1039]');

    private readonly _uniKsAndPsRegExp = new RegExp(`^\u1004\u103A\u1039[${rUniPsUpC}]\u1039[${rUniPsLoC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31}`);
    private readonly _uniKsAndCRegExp = new RegExp(`^\u1004\u103A\u1039[${rUniC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31}`);
    private readonly _uniPsRegExp = new RegExp(`^[${rUniPsUpC}]\u1039[${rUniPsLoC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31}`);
    private readonly _uniPsLeftEndRegExp = new RegExp(`${rUniC}\u103B?\u103C?[\u103D\u103E]?\u1031?\u102D?\u102F?[\u102B\u102C]?$`);
    private readonly _uniCAndOptionalRegExp = new RegExp(`^[${rUniC}]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?${rUniAcAf31}`);
    private readonly _uniNotInZgRegExp = new RegExp('[\u1022\u1028\u1035\u103E\u103F]');

    constructor(@Optional() @Inject(ZAWGYI_DETECTOR_OPTIONS) options?: ZawgyiDetectorOptions) {
        if (options) {
            this._options = options;
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
        let lastMatchedStr = '';
        let lastDetectedEnc: DetectedEnc = null;
        let zgProbability = 0;
        let uniProbability = 0;

        while (curStr.length > 0) {
            let d: DetectorMatch | null = null;
            if (this._zg31Or3bStartWOptionalSpRegExp.test(curStr)) {
                d = this.detectZgMax(curStr, lastDetectedEnc, lastMatchedStr);
            }

            if (d == null) {
                const ud = this.detectUniMax(curStr, lastDetectedEnc, lastMatchedStr);
                const zd = this.detectZgMax(curStr, lastDetectedEnc, lastMatchedStr, ud == null);

                if (ud != null && zd != null) {
                    d = zd.probability > ud.probability ? zd : ud;
                } else if (ud != null) {
                    d = ud;
                } else if (zd != null) {
                    d = zd;
                }
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

                lastDetectedEnc = d.detectedEnc;
                lastMatchedStr += d.matchedString;
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

    private detectZgMax(curStr: string, lastDetectedEnc: DetectedEnc, lastMatchedStr: string, max?: boolean): DetectorMatch | null {
        let matchedString = '';
        let probabilitySum = 0;
        let totoalMatchedCount = 0;

        while (curStr.length > 0) {
            let d = this.detectZg31Start(curStr, lastDetectedEnc, lastMatchedStr + matchedString);

            if (d == null) {
                d = this.detectZg3bStart(curStr, lastDetectedEnc, lastMatchedStr + matchedString);
            }

            if (d == null) {
                d = this.detectZgPahsinAndOptional(curStr, lastDetectedEnc);
            }

            if (d == null) {
                d = this.detectZgCAndOptionalMax(curStr, lastDetectedEnc, matchedString);
            }

            if (d == null) {
                if (lastMatchedStr.length === 0 || lastDetectedEnc == null) {
                    d = this.detectAcPrefixAndOutsideBlock(curStr);
                } else {
                    d = this.detectOutsideUnicodeBlock(curStr);
                }
            }

            if (d == null && max) {
                d = this.detectOtherCharsNonUni(curStr);
            }

            if (d == null || !d.matchedString) {
                break;
            }

            matchedString += d.matchedString;
            lastDetectedEnc = d.detectedEnc;
            curStr = curStr.substring(d.matchedString.length);

            if (d.probability > 0) {
                probabilitySum += d.probability;
                ++totoalMatchedCount;
            }
        }

        if (!matchedString.length) {
            return null;
        }

        const probability = totoalMatchedCount > 0 ? probabilitySum / totoalMatchedCount : 0;

        return {
            detectedEnc: 'zg',
            probability,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectZgMin(curStr: string, lastMatchedStr: string): DetectorMatch {
        let matchedString = '';
        let probabilitySum = 0;
        let totoalMatchedCount = 0;

        while (curStr.length > 0) {
            let d = this.detectZg31Start(curStr, 'zg', lastMatchedStr + matchedString);

            if (d == null) {
                d = this.detectZg3bStart(curStr, 'zg', lastMatchedStr + matchedString);
            }

            if (d == null) {
                d = this.detectZgPahsinAndOptional(curStr, 'zg');
            }

            if (d == null) {
                d = this.detectZgCAndOptionalMin(curStr);
            }

            if (d == null || !d.matchedString) {
                break;
            }

            matchedString += d.matchedString;
            curStr = curStr.substring(d.matchedString.length);
            probabilitySum += d.probability;
            ++totoalMatchedCount;
        }

        const probability = totoalMatchedCount > 0 ? probabilitySum / totoalMatchedCount : 0;

        return {
            detectedEnc: 'zg',
            probability,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectUniMax(curStr: string, lastDetectedEnc: DetectedEnc, lastMatchedStr: string): DetectorMatch | null {
        let matchedString = '';
        let probabilitySum = 0;
        let totoalMatchedCount = 0;

        while (curStr.length > 0) {
            let d: DetectorMatch | null = null;

            d = this.detectUniKinsi(curStr, lastDetectedEnc);

            if (d == null) {
                d = this.detectUniPahsin(curStr, lastDetectedEnc, lastMatchedStr + matchedString);
            }

            if (d == null) {
                d = this.detectUniCAndOptional(curStr, lastDetectedEnc);
            }

            if (d == null) {
                d = this.detectUniOnlyCodePoints(curStr);
            }

            if (d == null) {
                d = this.detectOtherCharsNonZg(curStr);
            }

            if (d == null) {
                if (lastMatchedStr.length === 0 || lastDetectedEnc == null) {
                    d = this.detectAcPrefixAndOutsideBlock(curStr);
                } else {
                    d = this.detectOutsideUnicodeBlock(curStr);
                }
            }

            if (d == null || !d.matchedString) {
                break;
            }

            matchedString += d.matchedString;
            lastDetectedEnc = d.detectedEnc;
            curStr = curStr.substring(d.matchedString.length);

            if (d.probability > 0) {
                probabilitySum += d.probability;
                ++totoalMatchedCount;
            }
        }

        if (!matchedString.length) {
            return null;
        }

        const probability = totoalMatchedCount > 0 ? probabilitySum / totoalMatchedCount : 0;

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectUniMin(curStr: string, lastDetectedEnc: DetectedEnc, lastMatchedStr: string): DetectorMatch | null {
        let matchedString = '';
        let probabilitySum = 0;
        let totoalMatchedCount = 0;

        while (curStr.length > 0) {
            let d: DetectorMatch | null = null;

            d = this.detectUniKinsi(curStr, lastDetectedEnc);

            if (d == null) {
                d = this.detectUniPahsin(curStr, lastDetectedEnc, lastMatchedStr + matchedString);
            }

            if (d == null) {
                d = this.detectUniCAndOptional(curStr, lastDetectedEnc);
            }

            if (d == null) {
                d = this.detectUniOnlyCodePoints(curStr);
            }

            if (d == null || !d.matchedString) {
                break;
            }

            matchedString += d.matchedString;
            lastDetectedEnc = d.detectedEnc;
            curStr = curStr.substring(d.matchedString.length);

            if (d.probability > 0) {
                probabilitySum += d.probability;
                ++totoalMatchedCount;
            }
        }

        if (!matchedString.length) {
            return null;
        }

        const probability = totoalMatchedCount > 0 ? probabilitySum / totoalMatchedCount : 0;

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectZg31Start(curStr: string, lastDetectedEnc: DetectedEnc, lastMatchedStr: string): DetectorMatch | null {
        if (curStr[0] !== '\u1031') {
            return null;
        }

        if (curStr.length === 1 && lastMatchedStr.length > 0) {
            return {
                detectedEnc: 'zg',
                probability: lastDetectedEnc === 'zg' ? 0.1 : 0.05,
                start: -1,
                length: 1,
                matchedString: curStr
            };
        }

        if (curStr.length === 1 && lastMatchedStr.length === 0) {
            return {
                detectedEnc: 'zg',
                probability: 0.2,
                start: -1,
                length: 1,
                matchedString: curStr
            };
        }

        let probability = 0;
        let m: RegExpMatchArray | null = null;

        if (curStr.length >= 3) {
            m = curStr.match(this._zg31AndOptional3bWPahsinRegExp);
            if (m != null) {
                probability = 0.9;
            }
        }

        if (m == null) {
            m = curStr.match(this._zg31AndOptional3bWPahsinSingleRegExp);
            if (m != null) {
                probability = 0.9;
            }
        }

        if (m == null) {
            m = curStr.match(this._zg31AndOptional3bWCRegExp);
            if (m != null) {
                probability = lastDetectedEnc === 'zg' ? 0.7 : 0.6;
            }
        }

        if (m == null) {
            m = curStr.match(this._zg31AndOptional3bStartRegExp);
            if (m != null) {
                probability = lastDetectedEnc === 'zg' ? 0.2 : 0.15;
            }
        }

        if (m == null) {
            return null;
        }

        const matchedStr = m[0];

        return {
            detectedEnc: 'zg',
            probability,
            start: -1,
            length: matchedStr.length,
            matchedString: matchedStr
        };
    }

    private detectZg3bStart(curStr: string, lastDetectedEnc: DetectedEnc, lastMatchedStr: string): DetectorMatch | null {
        const c = curStr[0];

        if (c !== '\u103B' && c !== '\u107E' && c !== '\u107F' && c !== '\u1080' &&
            c !== '\u1081' && c !== '\u1082' && c !== '\u1083' && c !== '\u1084') {
            return null;
        }

        if (curStr.length === 1 && lastMatchedStr.length > 0) {
            return {
                detectedEnc: 'zg',
                probability: lastDetectedEnc === 'zg' ? 0.1 : 0.05,
                start: -1,
                length: 1,
                matchedString: curStr
            };
        }

        if (curStr.length === 1 && lastMatchedStr.length === 0) {
            return {
                detectedEnc: 'zg',
                probability: 0.2,
                start: -1,
                length: 1,
                matchedString: curStr
            };
        }

        let probability = 0;
        let m: RegExpMatchArray | null = null;

        if (curStr.length >= 3) {
            m = curStr.match(this._zg3bWPahsinRegExp);
            if (m != null) {
                probability = 0.9;
            }
        }

        if (m == null) {
            m = curStr.match(this._zg3bWPahsinSingleRegExp);
            if (m != null) {
                probability = 0.9;
            }
        }

        if (m == null) {
            m = curStr.match(this._zg3bWCRegExp);
            if (m != null) {
                probability = lastDetectedEnc === 'zg' ? 0.7 : 0.6;
            }
        }

        if (m == null) {
            m = curStr.match(this._zg3bStartRegExp);
            if (m != null) {
                probability = lastDetectedEnc === 'zg' ? 0.2 : 0.15;
            }
        }

        if (m == null) {
            return null;
        }

        const matchedStr = m[0];

        return {
            detectedEnc: 'zg',
            probability,
            start: -1,
            length: matchedStr.length,
            matchedString: matchedStr
        };
    }

    private detectZgPahsinAndOptional(curStr: string, lastDetectedEnc: DetectedEnc): DetectorMatch | null {
        let probability = 0;
        let matchedString = '';

        if (curStr.length >= 2) {
            const m = curStr.match(this._zgPahsinRegExp);
            if (m != null) {
                probability = lastDetectedEnc === 'zg' ? 0.9 : 0.8;
                matchedString = m[0];
            }
        }

        if (matchedString.length === 0) {
            const m = curStr.match(this._zgPahsinSingleRegExp);
            if (m != null) {
                probability = lastDetectedEnc === 'zg' ? 0.9 : 0.8;
                matchedString = m[0];
            }
        }

        if (matchedString.length === 0) {
            return null;
        }

        return {
            detectedEnc: 'zg',
            probability,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectZgCAndOptionalMax(curStr: string, lastDetectedEnc: DetectedEnc, lastMatchedStr: string): DetectorMatch | null {
        const m = curStr.match(this._zgCAndOptionalRegExp);
        if (m == null) {
            return null;
        }

        const matchedString = m[0];
        let probability = 0;

        if (matchedString.length > 1 && this._zgOnlyAcRegExp.test(matchedString)) {
            probability = lastDetectedEnc === 'zg' ? 0.8 : 0.6;
        } else if (matchedString.length > 2 && (this._zgOnlyAcRegExp.test(matchedString) ||
            this._zgOnlyAc2bOr2cCbRegExp.test(matchedString) || this._zgOnlyAc2dOr2eCbRegExp.test(matchedString) ||
            this._zgOnlyAc2fOr30CbRegExp.test(matchedString) || this._zgOnlyAc32Or36CbRegExp.test(matchedString) ||
            this._zgOnlyAc39CbRegExp.test(matchedString) || this._zgOnlyAc3ACbRegExp.test(matchedString))) {
            probability = lastDetectedEnc === 'zg' ? 0.8 : 0.6;
        } else {
            if (lastDetectedEnc !== 'zg') {
                const ud = this.detectUniMin(curStr, lastDetectedEnc, lastMatchedStr);
                if (ud != null) {
                    const zd = this.detectZgMin(curStr, lastMatchedStr);
                    if (ud.probability > zd.probability) {
                        return null;
                    }
                }
            }

            if (matchedString.length > 2) {
                probability = lastDetectedEnc === 'zg' ? 0.6 : 0.55;
            } else {
                probability = lastDetectedEnc === 'zg' ? 0.5 : 0.3;
            }
        }

        if (matchedString.length === 0) {
            return null;
        }

        return {
            detectedEnc: 'zg',
            probability,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectZgCAndOptionalMin(curStr: string): DetectorMatch | null {
        const m = curStr.match(this._zgCAndOptionalRegExp);
        if (m == null) {
            return null;
        }

        const matchedString = m[0];
        let probability = 0;

        if (matchedString.length > 1 && this._zgOnlyAcRegExp.test(matchedString)) {
            probability = 0.8;
        } else if (matchedString.length > 2 && (this._zgOnlyAcRegExp.test(matchedString) ||
            this._zgOnlyAc2bOr2cCbRegExp.test(matchedString) || this._zgOnlyAc2dOr2eCbRegExp.test(matchedString) ||
            this._zgOnlyAc2fOr30CbRegExp.test(matchedString) || this._zgOnlyAc32Or36CbRegExp.test(matchedString) ||
            this._zgOnlyAc39CbRegExp.test(matchedString) || this._zgOnlyAc3ACbRegExp.test(matchedString))) {
            probability = 0.8;
        } else {
            if (matchedString.length > 2) {
                probability = 0.6;
            } else {
                probability = 0.5;
            }
        }

        if (matchedString.length === 0) {
            return null;
        }

        return {
            detectedEnc: 'zg',
            probability,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectOtherCharsNonUni(curStr: string): DetectorMatch | null {
        let matchedString = '';

        for (const c of curStr) {
            const cp = c.codePointAt(0);
            if (cp && (cp === 0x1022 || cp === 0x1028 || cp === 0x1035 || cp === 0x103E || cp === 0x103F ||
                (cp >= 0x1050 && cp <= 0x1059) || (cp >= 0x105B && cp <= 0x105F) || (cp >= 0x1098 && cp <= 0x109F) ||
                (cp >= 0xA9E0 && cp <= 0xA9FF) || (cp >= 0xAA60 && cp <= 0xAA7F))) {
                break;
            } else {
                matchedString += c;
            }
        }

        if (!matchedString.length) {
            return null;
        }

        return {
            detectedEnc: null,
            probability: 0,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectUniKinsi(curStr: string, lastDetectedEnc: DetectedEnc): DetectorMatch | null {
        if (curStr.length < 3) {
            return null;
        }

        const c1 = curStr[0];
        const c2 = curStr[1];
        const c3 = curStr[2];

        if (c1 !== '\u1004' && c2 !== '\u103A' && c3 !== '\u1039') {
            return null;
        }

        if (curStr.length === 3) {
            return {
                detectedEnc: 'uni',
                probability: lastDetectedEnc === 'uni' ? 0.7 : 0.3,
                start: -1,
                length: 3,
                matchedString: '\u1004\u103A\u1039'
            };
        }

        let m: RegExpMatchArray | null = null;
        const probability = lastDetectedEnc === 'uni' ? 0.9 : 0.5;

        if (curStr.length >= 6 && curStr[4] === '\u1039') {
            // Kinsi + Pahsin + (Optional)
            m = curStr.match(this._uniKsAndPsRegExp);
        }

        if (m == null) {
            // Kinsi + C + (Optional)
            m = curStr.match(this._uniKsAndCRegExp);
        }

        if (m == null) {
            return null;
        }

        const matchedString = m[0];

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectUniPahsin(curStr: string, lastDetectedEnc: DetectedEnc, lastMatchedStr: string): DetectorMatch | null {
        if (curStr.length < 3) {
            return null;
        }

        if (curStr[1] !== '\u1039') {
            return null;
        }

        const m = curStr.match(this._uniPsRegExp);

        if (m == null) {
            return null;
        }

        const matchedString = m[0];
        let probability = lastDetectedEnc === 'uni' ? 0.5 : 0.15;

        if (lastDetectedEnc === 'uni' && this._uniPsLeftEndRegExp.test(lastMatchedStr)) {
            probability = 0.55;
        }

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectUniCAndOptional(curStr: string, lastDetectedEnc: DetectedEnc): DetectorMatch | null {
        const m = curStr.match(this._uniCAndOptionalRegExp);
        if (m == null) {
            return null;
        }

        const matchedString = m[0];
        let probability = lastDetectedEnc === 'uni' ? 0.5 : 0.3;

        const notInZg = this._uniNotInZgRegExp.test(matchedString);

        if (notInZg) {
            probability = lastDetectedEnc === 'uni' ? 0.9 : 0.8;
        } else if (matchedString.length > 1 && matchedString.includes('\u1031') || matchedString.includes('\u103B')) {
            probability = lastDetectedEnc === 'uni' ? 0.7 : 0.6;
        } else if (lastDetectedEnc === 'uni' && matchedString.length > 1) {
            probability = 0.55;
        }

        return {
            detectedEnc: 'uni',
            probability,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectUniOnlyCodePoints(curStr: string): DetectorMatch | null {
        let matchedString = '';

        for (const c of curStr) {
            const cp = c.codePointAt(0);
            if (cp && (cp === 0x1022 || cp === 0x1028 || cp === 0x1035 || cp === 0x103E || cp === 0x103F ||
                (cp >= 0x1050 && cp <= 0x1059) || (cp >= 0x105B && cp <= 0x105F) || (cp >= 0x1098 && cp <= 0x109F) ||
                (cp >= 0xA9E0 && cp <= 0xA9FF) || (cp >= 0xAA60 && cp <= 0xAA7F))) {
                matchedString += c;
            } else {
                break;
            }
        }

        if (!matchedString.length) {
            return null;
        }

        return {
            detectedEnc: 'uni',
            probability: 1,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectOtherCharsNonZg(curStr: string): DetectorMatch | null {
        let matchedString = '';

        for (const c of curStr) {
            const cp = c.codePointAt(0);
            if (cp && ((cp >= 0x1000 && cp <= 0x1021) ||
                (cp >= 0x1023 && cp <= 0x1027) ||
                (cp >= 0x1029 && cp <= 0x1034) ||
                (cp >= 0x1036 && cp <= 0x103D) ||
                (cp >= 0x1040 && cp <= 0x104F) ||
                (cp === 0x105A) ||
                (cp >= 0x1060 && cp <= 0x1097))) {
                break;
            } else {
                matchedString += c;
            }
        }

        if (!matchedString.length) {
            return null;
        }

        return {
            detectedEnc: null,
            probability: 0,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectAcPrefixAndOutsideBlock(curStr: string): DetectorMatch | null {
        let matchedString = '';

        for (const c of curStr) {
            const cp = c.codePointAt(0);
            if (cp && ((cp >= 0x102B && cp <= 0x1030) ||
                (cp >= 0x1032 && cp <= 0x103A) ||
                (cp >= 0x103C && cp <= 0x103E) ||
                cp === 0x105A)) {
                matchedString += c;
            } if (cp && ((cp >= 0x1000 && cp <= 0x109F) || (cp >= 0xA9E0 && cp <= 0xA9FF) || (cp >= 0xAA60 && cp <= 0xAA7F))) {
                break;
            } else {
                matchedString += c;
            }
        }

        if (!matchedString.length) {
            return null;
        }

        return {
            detectedEnc: 'mix',
            probability: 0,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }

    private detectOutsideUnicodeBlock(curStr: string): DetectorMatch | null {
        let matchedString = '';

        for (const c of curStr) {
            const cp = c.codePointAt(0);
            if (cp && ((cp >= 0x1000 && cp <= 0x109F) || (cp >= 0xA9E0 && cp <= 0xA9FF) || (cp >= 0xAA60 && cp <= 0xAA7F))) {
                break;
            } else {
                matchedString += c;
            }
        }

        if (!matchedString.length) {
            return null;
        }

        return {
            detectedEnc: null,
            probability: 0,
            start: -1,
            length: matchedString.length,
            matchedString
        };
    }
}
