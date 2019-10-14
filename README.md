# Zawgyi and Standard Myanmar Unicode Detector for Angular

[![Build Status](https://dev.azure.com/myanmartools/ng-zawgyi-detector/_apis/build/status/myanmartools.ng-zawgyi-detector?branchName=master)](https://dev.azure.com/myanmartools/ng-zawgyi-detector/_build/latest?definitionId=2&branchName=master)
[![CircleCI](https://circleci.com/gh/myanmartools/ng-zawgyi-detector/tree/master.svg?style=svg)](https://circleci.com/gh/myanmartools/ng-zawgyi-detector/tree/master)
[![codecov](https://codecov.io/gh/myanmartools/ng-zawgyi-detector/branch/master/graph/badge.svg)](https://codecov.io/gh/myanmartools/ng-zawgyi-detector)
[![npm version](https://img.shields.io/npm/v/@myanmartools/ng-zawgyi-detector.svg)](https://www.npmjs.com/package/@myanmartools/ng-zawgyi-detector)
[![Gitter](https://badges.gitter.im/myanmartools/community.svg)](https://gitter.im/myanmartools/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Zawgyi-One and standard Myanmar Unicode detector library for Angular applications.

## Features

* Accurate & performance optimized detection for both Zawgyi-One (ဇော်ဂျီ) and standard Myanmar Unicode (မြန်မာ ယူနီကုဒ်)
* Intelligent chunk by chunk detection on mix-typed input (Mixed Zawgyi and Unicode)
* Fully tested with Myanmar Spelling Book (မြန်မာ စာလုံးပေါင်း သတ်ပုံကျမ်း) data
* Deep detection on `A That` (အသက်), `Pahsin` (ပါဌ်ဆင့်), `Kinsi` (ကင်းစီး), etc.
* Work with latest version of Angular
* Compatible with Angular Universal (Node.js Server Side Rendering - SSR)
* Open source and MIT license!

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

### Usage and Application

See [Zawgyi Unicode Converter Angular PWA](https://github.com/myanmartools/zawgyi-unicode-converter) repo.

#### Live Application

[![Zawgyi Unicode Converter](https://zawgyi-unicode-converter.myanmartools.org/assets/appicons/v1/ios/ios-appicon-180x180.png)](https://zawgyi-unicode-converter.myanmartools.org)

[https://zawgyi-unicode-converter.myanmartools.org](https://zawgyi-unicode-converter.myanmartools.org)

## Feedback and Contributing

Check out the [Contributing](https://github.com/myanmartools/ng-zawgyi-detector/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/myanmartools/ng-zawgyi-detector/blob/master/LICENSE) license.
