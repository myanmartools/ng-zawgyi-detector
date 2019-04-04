import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';

// tslint:disable: no-implicit-dependencies
import { ZawgyiDetector } from '@myanmartools/ng-zawgyi-detector';

export type DetectedEncType = 'zg' | 'uni' | null | '';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
    autoEncText = 'AUTO';
    debugMsg = '';

    private readonly _detectSubject = new Subject<string>();
    private readonly _destroyed = new Subject<void>();

    private _sourceText = '';

    private _detectedEnc: DetectedEncType;

    get detectedEnc(): DetectedEncType {
        return this._detectedEnc;
    }

    get sourceText(): string {
        return this._sourceText;
    }
    set sourceText(value: string) {
        this._sourceText = value;
        this.detectNext();
    }

    constructor(private readonly _zawgyiDetector: ZawgyiDetector) { }

    ngOnInit(): void {
        this._detectSubject.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            filter((input) => input.length > 0),
            takeUntil(this._destroyed),
            switchMap(input => this._zawgyiDetector.detect(input))
        ).subscribe(result => {
            if (result.detectedEnc === 'zg') {
                this.resetAutoEncText('ZAWGYI DETECTED');
                this._detectedEnc = 'zg';
            } else if (result.detectedEnc === 'uni') {
                this.resetAutoEncText('UNICODE DETECTED');
                this._detectedEnc = 'uni';
            } else {
                this.resetAutoEncText();
                this._detectedEnc = null;
            }

            let debugMsg = '';
            debugMsg += `Detected enc: ${result.detectedEnc}<br>`;
            debugMsg += `Probability: ${result.probability}<br>`;
            debugMsg += `Std cp: ${result.stdCodePointsMatchedCount}<br>`;
            debugMsg += `Ext cp: ${result.extCodePointsMatchedCount}<br>`;
            if (result.uniMatches && result.uniMatches.length > 0) {
                debugMsg += 'Unicode matches:<br>';
                for (const m of result.uniMatches) {
                    debugMsg += `Start: ${m.start}, end: ${m.end}, , str: ${m.matchedStr}, str cp: `;
                    const cpArray: string[] = [];
                    for (const c of m.matchedStr) {
                        const cp = c.codePointAt(0);
                        if (cp != null) {
                            cpArray.push(`\\u${cp.toString(16)}`);
                        }
                    }
                    debugMsg += `${cpArray.join('')}<br>`;
                }
            }

            if (result.zgMatches && result.zgMatches.length > 0) {
                debugMsg += 'Zawgyi matches:<br>';
                for (const m of result.zgMatches) {
                    debugMsg += `Start: ${m.start}, end: ${m.end}, , str: ${m.matchedStr}, str cp: `;
                    const cpArray: string[] = [];
                    for (const c of m.matchedStr) {
                        const cp = c.codePointAt(0);
                        if (cp != null) {
                            cpArray.push(`\\u${cp.toString(16)}`);
                        }
                    }
                    debugMsg += `${cpArray.join('')}<br>`;
                }

            }

            debugMsg += 'Input:<br>';
            const inputCpArray: string[] = [];
            for (const c of this.sourceText) {
                const cp = c.codePointAt(0);
                if (cp != null) {
                    inputCpArray.push(`\\u${cp.toString(16)}`);
                }
            }
            debugMsg += `${inputCpArray.join('')}<br>`;

            this.debugMsg = debugMsg;
        });
    }

    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    private resetAutoEncText(text?: string): void {
        this.autoEncText = text || 'AUTO';
    }

    private detectNext(): void {
        if (!this.sourceText || !this.sourceText.length || !this.sourceText.trim().length) {
            this.resetAutoEncText();
            this._detectedEnc = null;

            this._detectSubject.next('');

            return;
        }

        this._detectSubject.next(this.sourceText);
    }
}
