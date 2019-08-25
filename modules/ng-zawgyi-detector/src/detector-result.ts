export type DetectedEnc = 'zg' | 'uni' | 'mix' | null;

export interface DetectorMatch {
    detectedEnc: DetectedEnc;
    probability: number;
    start: number;
    length: number;
    matchedString?: string;
}

/**
 * The ZawgyiDetector result.
 */
export interface DetectorResult {
    detectedEnc: DetectedEnc;
    duration: number;
    matches: DetectorMatch[];
}
