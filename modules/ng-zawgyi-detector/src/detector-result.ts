/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

export type DetectedEnc = 'zg' | 'uni' | 'mix' | null;

export interface DetectorMatch {
    detectedEnc: DetectedEnc;
    probability: number;
    start: number;
    length: number;
    matchedString: string;
    competitorMatch?: DetectorMatch;
}

/**
 * ZawgyiDetector result.
 */
export interface DetectorResult {
    detectedEnc: DetectedEnc;
    duration: number;
    matches: DetectorMatch[];
}
