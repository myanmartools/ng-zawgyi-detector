export type DetectedEnc = 'zg' | 'uni' | 'mix' | null;

export interface DetectorMatch {
    detectedEnc: DetectedEnc;
    probability: number;
    start: number;
    length: number;
    matchedString?: string;
}

export interface DetectorResult {
    detectedEnc: DetectedEnc;
    duration: number;
    matches: DetectorMatch[];
}
