# Zawgyi and Standard Myanmar Unicode Detector for Angular

[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Zawgyi-One and standard Myanmar Unicode font encoding detection library for Angular applications.

## Features

* Accurate & performance optimized detection for both Zawgyi-One and standard Myanmar Unicode
* Intelligent chunk by chunk detection on mix-typed input (Mixed Zawgyi and Unicode)
* Fully tested with Myanmar Spelling Book (မြန်မာ စာလုံးပေါင်း သတ်ပုံကျမ်း)
* Open source and MIT license!
* Work with latest versions of Angular
* Compatible with Angular Universal (Server Side Rendering - SSR)

## Get Started

### Installation

npm

```bash
npm install @myanmartools/ng-zawgyi-detector
```

or yarn

```bash
yarn add @myanmartools/ng-zawgyi-detector
```

### Module Setup (app.module.ts)

```typescript
import { ZawgyiDetectorModule } from '@myanmartools/ng-zawgyi-detector';

@NgModule({
  imports: [
    // Other module imports

    // ng-zawgyi-detector module
    ZawgyiDetectorModule
  ]
})
export class AppModule { }
```

### Usage (app.component.ts)

```typescript
import { Component } from '@angular/core';

import { ZawgyiDetector } from '@myanmartools/ng-zawgyi-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private readonly _zawgyiDetector: ZawgyiDetector) {
    const result = this._zawgyiDetector.detect('ျမန္မာစာ');
      if (result.detectedEnc === 'zg') {
          console.log('ZAWGYI DETECTED');
      } else if (result.detectedEnc === 'uni') {
          console.log('UNICODE DETECTED');
      }
  }
}
```

## Live Application

* [Zawgyi Unicode Converter](https://zawgyi-unicode-converter.myanmartools.org) - Angular Progress Web Application designed to convert Myanmar font encodings between Zawgyi-One and Standard Myanmar Unicode

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-zawgyi-detector/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-zawgyi-detector/blob/master/LICENSE) license.
