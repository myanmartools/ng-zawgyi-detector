[![Build Status](https://dev.azure.com/myanmartools/ng-zawgyi-detector/_apis/build/status/myanmartools.ng-zawgyi-detector?branchName=master)](https://dev.azure.com/myanmartools/ng-zawgyi-detector/_build/latest?definitionId=2&branchName=master)
[![Build status](https://ci.appveyor.com/api/projects/status/t085y7bwcjgvtl2e?svg=true)](https://ci.appveyor.com/project/admindagonmetriccom/ng-zawgyi-detector)

# Zawgyi / Myanmar Unicode Detector for Angular

[![Gitter](https://badges.gitter.im/myanmartools/community.svg)](https://gitter.im/myanmartools/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Contains Zawgyi-One or Myanmar Unicode font encoding detection modules for [Angular](https://angular.io/) applications.

## Get Started

### Installation

npm

```shell
npm install @myanmartools/ng-zawgyi-detector
```

or yarn

```shell
yarn add @myanmartools/ng-zawgyi-detector
```

### Module Setup (app.module.ts)

```typescript
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ZawgyiDetectorModule } from '@myanmartools/ng-zawgyi-detector';
import { HttpZgUniRuleLoaderModule } from '@myanmartools/ng-zawgyi-detector/http-loader';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        // Other module imports

        // ng-zawgyi-detector
        ZawgyiDetectorModule,
        HttpZgUniRuleLoaderModule
    ],
    bootstrap: [AppComponent]
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

### Copying Built-in Rules

Built-in zawgyi / unicode detect rules file is included with the package @myanmartools/ng-zawgyi-detector. Copy that rule file to output path. Here is Angular CLI configuration to copy assets:

```json
{
    "assets": [
    {
        "input": "node_modules/@myanmartools/ng-zawgyi-detector/rules/",
        "glob": "**/*.json",
        "output": "./assets/zawgyi-detect-rules"
    },
    "src/favicon.ico",
    "src/assets"
    ]
}
```

See [angular.json](https://github.com/myanmartools/ng-zawgyi-detector/blob/master/angular.json) file for more details.

## Example Project

[ng-zawgyi-detector-demo](https://github.com/myanmartools/ng-zawgyi-detector/tree/master/samples/ng-zawgyi-detector-demo)

## Live Website (Angular PWA)

[Zawgyi Unicode Converter](https://zawgyi-unicode-converter.myanmartools.com)

## Packages

[@myanmartools/ng-zawgyi-detector](https://www.npmjs.com/package/@myanmartools/ng-zawgyi-detector)

[![npm (scoped)](https://img.shields.io/npm/v/@myanmartools/ng-zawgyi-detector.svg)](https://www.npmjs.com/package/@myanmartools/ng-zawgyi-detector)
[![npm](https://img.shields.io/npm/dm/@myanmartools/ng-zawgyi-detector.svg)](https://www.npmjs.com/package/@myanmartools/ng-zawgyi-detector)

## Feedback and Contributing

Check out the [Contributing](https://github.com/myanmartools/ng-zawgyi-detector/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/myanmartools/ng-zawgyi-detector/blob/master/LICENSE) license.