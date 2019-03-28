export interface ZgUniMatchInfo {
    start: number;
    end: number;
    matchedStr: string;
    test: string;
    testDescription?: string;
}

export interface ZgUniDetectResult {
    detectedEnc: 'zg' | 'uni' | null;
    // Should re-detect < 0.3
    probability: number;
    containsUnicodeBlocks: boolean;
    stdCodePointsMatchedCount: number;
    extCodePointsMatchedCount: number;
    zgMatches: ZgUniMatchInfo[];
    uniMatches: ZgUniMatchInfo[];
}
