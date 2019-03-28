import { ZgUniRule, ZgUniRuleItem } from './zg-uni-rule';

export interface ZgUniRuleRegExpItem extends ZgUniRuleItem {
    testRegExp: RegExp;
    excludeRegExps?: RegExp[];
}

export interface ZgUniRegExpRule extends ZgUniRule {
    zgRegExpRules: ZgUniRuleRegExpItem[];
    uniRegExpRules: ZgUniRuleRegExpItem[];
}
