import { DetectorResult } from '../src';

export function formatCodePoints(str?: string): string {
    if (str == null) {
        return '';
    }

    const cpArray: string[] = [];
    for (const c of str) {
        const cp = c.codePointAt(0);
        if (cp != null && /[\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF]/.test(c)) {
            cpArray.push(`\\u${cp.toString(16)}`);
        } else if (/[\b\f\n\r\t\v]/.test(c)) {
            if (c === '\n') {
                cpArray.push('\\n');
            } else if (c === '\r') {
                cpArray.push('\\r');
            } else if (c === '\t') {
                cpArray.push('\\t');
            } else if (c === '\f') {
                cpArray.push('\\f');
            } else if (c === '\v') {
                cpArray.push('\\v');
            } else if (c === '\b') {
                cpArray.push('\\b');
            }
        } else {
            cpArray.push(`${c}`);
        }
    }

    return cpArray.join('');
}

export function toFailOutput(input: string, result: DetectorResult): string {
    let str = `\n\ninput: ${formatCodePoints(input)}\n\n`;
    str += `detectedEnc: ${result.detectedEnc}\n`;

    if (result.matches) {
        str += '\nMatches:\n';
        for (const match of result.matches) {
            str += `detectedEnc: ${match.detectedEnc}\n`;
            str += `probability: ${match.probability}\n`;
            str += `start: ${match.start}\n`;
            str += `length: ${match.length}\n`;
            str += `matchedString cp: ${match.matchedString}\n`;
            str += `matchedString cp: ${formatCodePoints(match.matchedString)}\n`;
            if (match.competitorMatch != null) {
                const competitorMatch = match.competitorMatch;
                str += '\nCompetitor Matches:\n';
                str += `detectedEnc: ${competitorMatch.detectedEnc}\n`;
                str += `probability: ${competitorMatch.probability}\n`;
                str += `start: ${competitorMatch.start}\n`;
                str += `length: ${competitorMatch.length}\n`;
                str += `matchedString cp: ${competitorMatch.matchedString}\n`;
                str += `matchedString cp: ${formatCodePoints(competitorMatch.matchedString)}\n`;
            }

            str += '\n';
        }
    }

    return str;
}
