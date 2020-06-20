import { Component, ViewEncapsulation } from '@angular/core';

import { ZawgyiDetector } from '@dagonmetric/ng-zawgyi-detector';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    constructor(private readonly zawgyiDetector: ZawgyiDetector) {
        const result = this.zawgyiDetector.detect('ျမန္မာစာ');
        if (result.detectedEnc === 'zg') {
            // eslint-disable-next-line no-console
            console.log('ZAWGYI DETECTED');
        } else if (result.detectedEnc === 'uni') {
            // eslint-disable-next-line no-console
            console.log('UNICODE DETECTED');
        }
    }
}
