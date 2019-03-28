# Zawgyi / Myanmar Unicode Detector Package for Angular Applications

[![Gitter](https://badges.gitter.im/myanmartools/community.svg)](https://gitter.im/myanmartools/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Zawgyi-One or Myanmar Unicode font encoding detection library for Angular applications.

[WIP]

## Installation

npm

```shell
npm install @myanmartools/ng-zawgyi-detector
```

or yarn

```shell
yarn add @myanmartools/ng-zawgyi-detector
```

## Module Setup (app.module.ts)

```typescript
import { ZawgyiDetectorModule } from '@myanmartools/ng-zawgyi-detector';

@NgModule({
    imports: [
        // Other module imports

        // ng-zawgyi-detector
        ZawgyiDetectorModule
    ]
})
export class AppModule { }
```

## Usage (app.component.ts)

```typescript
import { Component } from '@angular/core';

import { ZawgyiDetector } from '@myanmartools/ng-zawgyi-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
    input = 'ေဇာ္ဂ်ီ';

    constructor(private readonly _zawgyiDetector: ZawgyiDetector) {
        this._zawgyiDetector.detect(this.input).subscribe(result => {
            if (result.detectedEnc === 'zg') {
                console.log('ZAWGYI DETECTED');
            } else if (result.detectedEnc === 'uni') {
                console.log('UNICODE DETECTED');
            }
        });
    }
}
```

## Example

[Zawgyi-One or Myanmar Unicode Font Detector Demo](https://github.com/myanmartools/ng-zawgyi-detector/tree/master/samples/zawgyi-unicode-detector-demo)

## Feedback and Contributing

Check out the [Contributing](https://github.com/myanmartools/ng-zawgyi-detector/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/myanmartools/ng-zawgyi-detector/blob/master/LICENSE) license.