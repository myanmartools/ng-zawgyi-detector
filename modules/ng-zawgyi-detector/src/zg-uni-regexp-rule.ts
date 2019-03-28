import { ZgUniRuleItem } from './zg-uni-rule';

export interface ZgUniRuleRegExpItem extends ZgUniRuleItem {
    testRegExp: RegExp;
    excludeRegExps?: RegExp[];
}

export interface ZgUniRegExpRule {
    zgRegExpRules: ZgUniRuleRegExpItem[];
    uniRegExpRules: ZgUniRuleRegExpItem[];
}
